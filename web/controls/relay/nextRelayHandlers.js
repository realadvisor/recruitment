/* @flow */

// TODO: add ErrorsStore from crm to show errors
import invariant from 'tiny-invariant';
import { fetchQuery, createOperationSelector, getRequest } from 'relay-runtime';
import type { Languages } from '../../server/UserData';
import { createRelayEnvironment } from './createRelayEnvironment';
import { isInCache, setInCache } from './variablesCache';
import type { CacheStrategy } from './nextQuery';

const fetchRelayQuery = async (
  environment: any,
  asPath: string,
  {
    query,
    variables,
    cacheStrategy,
  }: {
    query: any,
    variables: {},
    cacheStrategy: CacheStrategy,
  }
) => {
  let data = null;
  let operationFragment = null;
  let operationRoot = null;

  const qRequest = getRequest(query);
  const operationName = qRequest.name;

  invariant(qRequest.operationKind === 'query', 'Expected query operation');

  const operation = createOperationSelector(qRequest, variables);

  // cache-list strategy is a hack to not reload list data on back button
  // this is the only difference from `cache-first` strategy
  const listCanBeCached =
    cacheStrategy == 'cache-list' && isInCache(operationName, variables);

  if (
    (cacheStrategy == 'cache-first' ||
      (cacheStrategy == 'cache-list' && listCanBeCached) ||
      cacheStrategy == 'cache-only') &&
    environment.check(operation.root)
  ) {
    // get from cache
    data = environment.lookup(operation.fragment).data;
    operationFragment = operation.fragment;

    // TODO: don't refetch if back button
    if (cacheStrategy == 'cache-first') {
      // run store update async
      fetchQuery(environment, query, variables).then(() => {
        // force update if route has not changed
        // it's some kind of subscription but instead we
        // just force to reread operationFragment from store
        /*
        if (Router.router.asPath === asPath) {
          Router.replace(Router.router, Router.router.asPath, {
            shallow: true,
          });
        }
        */
      });
    }
  } else {
    try {
      data = await fetchQuery(environment, query, variables);

      if (typeof window !== 'undefined') {
        environment.retain(operation.root);
        // THINK ABOUT: dispose previously retained operation
        // possibly not needed as every operation will be in cache even with one retain
        // and additional retain is not memory consuming operation
        // see environment.getStore()._roots for details
      }
      operationRoot = operation.root;
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return null;
    }
  }

  return {
    data,
    operationFragment,
    operationRoot,
    operationName,
  };
};

export const handleGetInitialProps = async ({
  queries,
  asPath,
  language,
}: {|
  queries: {
    [string]: {|
      query: any,
      variables: {},
      cacheStrategy: CacheStrategy,
    |},
  },
  asPath: string,
  language: Languages,
|}) => {
  let records = null;
  let statusCode = null;

  const rejectErrors = true;
  let environment = null;

  if (typeof window === 'undefined') {
    environment = createRelayEnvironment({ rejectErrors, language });
  } else {
    if (window.environment) {
      environment = window.environment;
    } else {
      environment = window.environment = createRelayEnvironment({
        rejectErrors,
        language,
      });
    }
  }

  // queries
  let data = null;

  const res = await Promise.all(
    Object.keys(queries).map(k =>
      fetchRelayQuery(environment, asPath, queries[k])
    )
  );

  data = Object.keys(queries).reduce(
    (r, k, index) =>
      res[index] != null
        ? {
            ...r,
            [k]: {
              ...res[index],
              variables: queries[k].variables,
            },
          }
        : r,
    {}
  );

  if (Object.keys(data).length !== Object.keys(queries).length) {
    // eslint-disable-next-line
    console.error(
      `Some data has not been loaded, queried "${Object.keys(queries).join(
        ', '
      )}", got "${Object.keys(data).join(', ')}" `
    );
    statusCode = 1302;
  }

  if (typeof window === 'undefined') {
    records = environment
      .getStore()
      .getSource()
      .toJSON();
  }

  return {
    data,
    records,
    statusCode,
  };
};

export const handleRender = (
  relayProps: ?{
    data: {
      [string]: {
        data: any,
        operationRoot: ?any,
        operationFragment: ?any,
        operationName: string,
        variables: {},
      },
    },
    records: ?any,
    statusCode: number,
  },
  language: Languages
) => {
  if (!relayProps) {
    return {
      relayData: null,
      environment: null,
      variables: null,
    };
  }

  let environment = typeof window !== 'undefined' ? window.environment : null;

  // records not null on server render, and on first client render
  if (relayProps.records != null && environment == null) {
    environment = createRelayEnvironment({
      records: relayProps.records,
      language,
    });
    if (typeof window !== 'undefined') {
      // first app render on a client so getInitialProps wasn't called
      window.environment = environment;

      invariant(
        Object.keys(relayProps.data).every(
          k => relayProps != null && relayProps.data[k].operationRoot != null
        ),
        'operationRoot must be provided'
      );

      Object.keys(relayProps.data).forEach(k => {
        if (environment != null && relayProps != null) {
          environment.retain(relayProps.data[k].operationRoot);
        }
      });
    }
  }

  if (typeof window !== 'undefined') {
    // cache initial variables
    // having that we use refetch for pagination, relay has no knowledge
    // that relay data is in cache, so we can check initial vars
    Object.keys(relayProps.data).forEach(k => {
      if (environment != null && relayProps != null) {
        const operationName = relayProps.data[k].operationName;
        const variables = relayProps.data[k].variables;
        setInCache(operationName, variables);
      }
    });
  }

  // to support cache first operation without subscriptions
  // if data was from cache, then operationFragment will be provided
  // after refetch shallow refresh will call current ender
  // so we could took updated data again
  const relayData: {
    [string]: {
      variables: {},
      data: any,
      operationName: string,
    },
  } = Object.keys(relayProps.data).reduce((r, k) => {
    if (relayProps == null) return r;

    const d = relayProps.data[k];

    return {
      ...r,
      [k]: {
        operationName: d.operationName,
        variables: d.variables,
        data:
          d.operationFragment && environment
            ? environment.lookup(d.operationFragment).data
            : d.data,
      },
    };
  }, {});

  // console.log(relayData, relayProps);

  return {
    relayData,
    environment,
    // variables: relayProps.variables,
  };
};
