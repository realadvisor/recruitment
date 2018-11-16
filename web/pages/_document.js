/* @flow */

import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { extractCritical } from 'emotion-server';
// import flush from 'styled-jsx/server'

// server context always has req
type Context = {
  asPath: string,
  req: {},
  res: {
    statusCode: number,
  },
  renderPage: any,
};

export default class MyDocument extends Document {
  static async getInitialProps(ctx: Context) {
    // renderPage
    const headTags = [];

    let pageContext: any;

    const initialProps = ctx.renderPage(
      Component => ({ pageContext: pageContextArg, ...props }) => {
        pageContext = pageContextArg;
        return <Component {...props} />;
      }
    );

    const styles = extractCritical(initialProps.html);
    const muiCss = pageContext ? pageContext.sheetsRegistry.toString() : '';

    if (ctx.res.statusCode < 200 || ctx.res.statusCode >= 400) {
      return { ...initialProps, ...styles, muiCss, headTags };
    }

    return {
      ...initialProps,
      ...styles,
      muiCss,
      headTags,
    };
  }

  constructor(props: any) {
    super(props);
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      __NEXT_DATA__.ids = ids;
    }
  }

  render() {
    const { css, muiCss } = this.props;

    return (
      <html>
        <Head>
          <meta
            name="viewport"
            content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height"
          />
          <style
            id={'jss-server-side'}
            dangerouslySetInnerHTML={{ __html: muiCss }}
          />
          <style dangerouslySetInnerHTML={{ __html: css }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
