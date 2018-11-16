/* @flow */
import * as React from 'react';
import { commitMutation } from 'react-relay';
import parseErrors, { type ValidationError } from './parseErrors.js';
import getRootFieldName from './getRootFieldName.js';
import { EnvironmentConsumer } from './environment.js';

type Input<T> = $Exact<$ElementType<$ElementType<T, 'variables'>, 'input'>>;
type Payload<T> = $Values<$ElementType<T, 'response'>>;

type Props<Mutation, ComponentProps> = {|
  ...$Exact<ComponentProps>,
  children: ({|
    mutate: (
      input: Input<Mutation>,
      onComplete?: (result: Payload<Mutation>) => void,
      onError?: (result: string) => void
    ) => void,
    resetError: () => void,
    mutating: boolean,
    error: ?string,
  |}) => React.Node,
|};

export type MutationType<Mutation, ComponentProps = {}> = React.ComponentType<
  Props<Mutation, ComponentProps>
>;

type MutationConfig<Mutation, ComponentProps> = {|
  updater?: ({
    store: any,
    // store record
    payload: any,
    input: Input<Mutation>,
    props: $ReadOnly<ComponentProps>,
  }) => void,

  optimisticUpdater?: ({
    store: any,
    // store record
    // payload: any,
    input: Input<Mutation>,
    props: $ReadOnly<ComponentProps>,
  }) => void,

  optimisticResponse?: (
    input: Input<Mutation>,
    props: $ReadOnly<ComponentProps>
  ) => $ElementType<Mutation, 'response'>,
|};

export function createMutation<
  Mutation: {|
    variables: {| input: Object |},
    response: $ReadOnly<Object>,
  |},
  ComponentProps: {}
>(
  mutation: {},
  config?: MutationConfig<Mutation, ComponentProps>
): MutationType<Mutation, ComponentProps> {
  const makeMutation = (
    environment: any,
    input: Input<Mutation>,
    props: ComponentProps,
    onComplete: (data: Payload<Mutation>) => void,
    onError: (errs: ValidationError[]) => void
  ) => {
    const updater = config && config.updater;
    const optimisticUpdater = config && config.optimisticUpdater;
    const optimisticResponse = config && config.optimisticResponse;

    commitMutation(environment, {
      mutation,
      variables: { input },

      ...(optimisticUpdater
        ? {
            optimisticUpdater: (store: any) => {
              optimisticUpdater({ store, input, props });
            },
          }
        : null),

      ...(updater
        ? {
            updater: (store: any) => {
              const rootField = getRootFieldName(environment, mutation);

              if (!rootField) {
                return;
              }

              const payload = store.getRootField(rootField);
              if (!payload) {
                // mutation contains errors
                return;
              }

              updater({ store, input, payload, props });
            },
          }
        : null),

      ...(optimisticResponse
        ? { optimisticResponse: optimisticResponse(input, props) }
        : null),
      onError(err) {
        onError([err]);
      },
      onCompleted(data: $ElementType<Mutation, 'response'>, errs) {
        if (errs) {
          onError(errs);
        } else {
          const rootField = getRootFieldName(environment, mutation);
          onComplete(data[rootField]);
        }
      },
    });
  };

  class MutationComponent extends React.Component<
    Props<Mutation, ComponentProps>,
    {
      mutatingCount: number,
      error: ?string,
    }
  > {
    state = {
      error: null,
      // use number if multiple mutations will be called simulateneously
      mutatingCount: 0,
    };

    _environment: mixed;

    _mounted = false;

    _updateState = obj => {
      if (this._mounted) {
        this.setState(obj);
      }
    };

    _resetError = () => {
      this._updateState({ error: null });
    };

    _addMutationCount = (delta: number) => {
      this._updateState(({ mutatingCount }) => ({
        mutatingCount: mutatingCount + delta,
      }));
    };

    _mutate: (
      input: Input<Mutation>,
      onComplete?: (result: Payload<Mutation>) => void,
      onError?: (result: string) => void
    ) => void = (input, onComplete, onError) => {
      const environment = this._environment;

      this._addMutationCount(1);

      makeMutation(
        environment,
        input,
        this.props,
        data => {
          this._updateState({ error: null });
          if (onComplete) {
            // usually we don't need result of mutation
            // but sometimes on object creation we need to change route
            // on newly created object, so we pass it
            onComplete(data);
          }
          this._addMutationCount(-1);
        },
        errs => {
          console.error('mutation failed - before parse', errs);
          const { error, errors = {} } = parseErrors(errs, {});
          console.error('mutation failed - after parse', error, errors, errs);
          if (onError) {
            onError(error != null ? error : 'Unknown error');
          }
          this._updateState({ error });

          this._addMutationCount(-1);
        }
      );
    };

    componentDidMount() {
      this._mounted = true;
    }

    componentWillUnmount() {
      this._mounted = false;
    }

    render() {
      const { mutatingCount, error } = this.state;

      return (
        <EnvironmentConsumer>
          {environment => {
            this._environment = environment;
            return this.props.children({
              mutate: this._mutate,
              resetError: this._resetError,
              error,
              mutating: mutatingCount > 0,
            });
          }}
        </EnvironmentConsumer>
      );
    }
  }

  return MutationComponent;
}
