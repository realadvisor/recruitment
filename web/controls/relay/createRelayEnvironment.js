// @flow
/* global fetch:false  Promise:false*/
import 'isomorphic-fetch';
import { format } from 'url';
import {
  Environment,
  Network,
  RecordSource,
  Store,
  ConnectionHandler,
  ViewerHandler,
} from 'relay-runtime';
import { getConfig } from '../../utils/getConfig';
import { getDelayedPromise } from './delayNetwork';

const { publicRuntimeConfig } = getConfig();

export type CreateRelayEnvironmentOptions = {
  token?: string,
  records?: ?Object,
  // We have to reject errors manually, because of fetchQuery design.
  // https://github.com/facebook/relay/issues/1816#issuecomment-309760368
  rejectErrors?: boolean,
};

const createNetwork = (token, rejectErrors) =>
  Network.create(
    (operation, variables) =>
      fetch(
        format({
          pathname:
            publicRuntimeConfig.apiEndpoint != null
              ? publicRuntimeConfig.apiEndpoint
              : 'http://localhost:8080/graphql',
        }),
        {
          method: 'POST',
          headers: {
            ...{ Cookie: 'code=9222' },
            'content-type': 'application/json',
            ...(token != null ? { authorization: `Bearer ${token}` } : null),
          },
          credentials: 'include',
          body: JSON.stringify({
            query: operation.text,
            variables,
          }),
        }
      )
        .then(response => response.json())
        .then(json => {
          if (rejectErrors === true && json.errors) {
            // [{"message":"Not Authorised!" is returned by server/api/permissions
            return Promise.reject(json.errors);
          }

          return getDelayedPromise(json);
        })
    // .then(r => new Promise(resolve => setTimeout(() => resolve(r), 1000)))
  );

const ConnHandler = {
  ...ConnectionHandler,
  update(store, payload) {
    const record = store.get(payload.dataID);
    if (!record) {
      return;
    }

    const serverViewer = record.getLinkedRecord(payload.fieldKey);
    // serverViewer is null if connection returned error
    // in that case just do nothing for now
    // otherwise on following request relay fails with
    // Uncaught Error: RelayRecordSourceMutator#create(): Cannot create a record with id
    if (serverViewer === null) {
      console.error(
        `Received data has errors, check network relay response for ${
          payload.dataID
        } ${payload.fieldKey}`
      );
      return;
    }

    return ConnectionHandler.update(store, payload);
  },
};

function handlerProvider(handle) {
  switch (handle) {
    // Augment (or remove from) this list:
    case 'connection':
      return ConnHandler;
    case 'viewer':
      return ViewerHandler;
    default:
      throw new Error(`handlerProvider: No handler provided for ${handle}`);
  }
}

export const createRelayEnvironment = (
  options: CreateRelayEnvironmentOptions
) => {
  const { token, records, rejectErrors } = options;
  const store = new Store(new RecordSource(records));
  const network = createNetwork(token, rejectErrors, options.language);
  return new Environment({ store, network, handlerProvider });
};
