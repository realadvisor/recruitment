/* @flow */

import * as React from 'react';
import Error from 'next/error';

export default class CustomError extends React.Component<{|
  statusCode: number,
|}> {
  static getInitialProps({
    res,
    err,
  }: {
    res: { statusCode?: ?number },
    err: { statusCode?: ?number },
  }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    return (
      <div
        css={`
          margin: auto;
          > div {
            background: unset !important;
            height: unset !important;
          }
        `}
      >
        <Error statusCode={this.props.statusCode} />
      </div>
    );
  }
}
