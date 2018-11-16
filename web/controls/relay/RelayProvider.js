// @flow

import * as React from 'react';
import PropTypes from 'prop-types';

// RelayProvider sets Relay context manually for SSR and pending navigations.
// Check App.getInitialProps, note "await fetchQuery". It replaces QueryRenderer.
// https://github.com/robrichard/relay-context-provider
// TODO: Recheck with every new Relay release.

// @istarkov: Seems like no need in Update context relay, all works fine without

type RelayProviderProps = {|
  environment: any,
  children: React.Node,
  variables: Object | null,
|};

export class RelayProvider extends React.PureComponent<RelayProviderProps> {
  static childContextTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    relay: PropTypes.object.isRequired,
  };

  _relay = {
    environment: this.props.environment,
    variables: this.props.variables,
  };

  getChildContext() {
    return {
      relay: this._relay,
    };
  }

  render() {
    this._relay.environment = this.props.environment;
    this._relay.variables = this.props.variables;

    return this.props.children;
  }
}
