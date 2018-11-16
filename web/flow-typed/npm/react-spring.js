/* eslint-disable */
/* @flow */

type Props<T> = $ReadOnly<{|
  to: T,
  from?: $Shape<T>,
  children: (params: T) => React$Node,
|}>;

declare module 'react-spring' {
  declare export class Spring<T: {}> extends React$Component<Props<T>> {}
}
