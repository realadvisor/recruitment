// @flow

import * as React from 'react';

type Props = {|
  emitter: {
    on: (name: string, fn: () => void) => void,
    off: (name: string) => void,
  },
  children: React.Node,
|};

type State = {|
  loading: boolean,
|};

const context = React.createContext<{| loading: boolean |}>({ loading: false });

export const LoadingConsumer = context.Consumer;

export const LoadingProvider = class extends React.Component<Props, State> {
  state = {
    loading: false,
  };

  componentDidMount() {
    this.props.emitter.on('loading:start', () => {
      this.setState({ loading: true });
    });
    this.props.emitter.on('loading:end', () => {
      this.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    this.props.emitter.off('loading:start');
    this.props.emitter.off('loading:end');
  }

  render() {
    return (
      <context.Provider value={this.state}>
        {this.props.children}
      </context.Provider>
    );
  }
};
