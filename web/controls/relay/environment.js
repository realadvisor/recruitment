// @flow

import * as React from 'react';

export const {
  Provider: EnvironmentProvider,
  Consumer: EnvironmentConsumer,
} = React.createContext<mixed>(() => {});
