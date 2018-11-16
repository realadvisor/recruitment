/* @flow */

import * as React from 'react';
import App, { Container } from 'next/app';
import { hydrate } from 'emotion';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import { MuiThemeProvider } from '@material-ui/core/styles';
import JssProvider from 'react-jss/lib/JssProvider';
import { create as createJss } from 'jss';
import { jssPreset } from '@material-ui/core/styles';
import { getPageContext } from '../theme/getPageContext';
import { EnvironmentProvider, RelayProvider } from '../controls/relay';
import { RouterProvider } from '../controls/router';
import { Layout } from '../shared/Layout';
import {
  handleGetInitialProps,
  handleRender,
} from '../controls/relay/nextRelayHandlers';
import { theme, injectGlobalStyle } from '../theme';
import type { CacheStrategy } from '../controls/relay';
import Error from './_error';

type Context = {
  asPath: string,
  query: {
    version?: string,
    editor?: string,
  },
  req?: {},
  res?: {
    statusCode: number,
  },
};

export default class StarterApp extends App {
  // Use this to provide Layout with data, like theme etc if needed
  // eslint-disable-next-line no-unused-vars

  static async getInitialProps({
    Component,
    ctx,
  }: {
    Component: {
      getInitialProps: Context => {},
      getRelay: Context => {|
        query: any,
        variables: {},
        cacheStrategy: CacheStrategy,
      |},
    },
    ctx: Context,
  }) {
    let pageProps = {};

    // Usual processing
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if (ctx.res && (ctx.res.statusCode < 200 || ctx.res.statusCode >= 400)) {
      // It's an Error
      return { pageProps };
    }
    // TODO: pass initial via router.query then on browser level save in window
    // this will allow to not use next internals.

    // here is the usual nextjs trick to read server provided data
    // read from req if on server, or read current method result serialized on server
    // see we return locale at the end of this function

    // Relay pages processing
    const queries = {
      ...(Component.getRelay ? { page: Component.getRelay(ctx) } : null),
    };

    const relayProps = await handleGetInitialProps({
      queries,
      asPath: ctx.asPath,
    });

    return {
      pageProps,
      relayStatusCode: relayProps.statusCode || null,
      relayProps,
    };
  }

  constructor(props: any) {
    super(props);

    this._pageContext = getPageContext();
    // https://github.com/emotion-js/emotion/blob/108d78aa176aedfddc0854ebe4049847a9ac2a9b/docs/ssr.md#hydrate
    if (typeof window !== 'undefined') {
      hydrate(window.__NEXT_DATA__.ids);

      // Use global to prevent adding insertion points on hot reload
      if (!global.__INIT_MATERIAL_UI_JSS__) {
        global.__INIT_MATERIAL_UI_JSS__ = createJss(jssPreset());

        const insertionPoint = document.createComment('jss-insertion-point');

        if (document.head) {
          document.head.insertBefore(
            insertionPoint,
            document.head.childNodes[0]
          );
          global.__INIT_MATERIAL_UI_JSS__.options.insertionPoint =
            'jss-insertion-point';
        }
      }
    }

    injectGlobalStyle();
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const {
      // version,
      Component,
      pageProps,
      relayProps,
      router,
    } = this.props;

    const isHMR = pageProps === undefined;
    if (isHMR) return null;

    if (pageProps.statusCode != null) {
      return <Error statusCode={pageProps.statusCode} />;
    }

    let { environment, relayData } = handleRender(relayProps);
    let pageData = relayData && relayData.page;

    return (
      <EnvironmentProvider value={environment}>
        <EmotionThemeProvider theme={theme}>
          <JssProvider
            jss={global.__INIT_MATERIAL_UI_JSS__}
            registry={this._pageContext.sheetsRegistry}
            generateClassName={this._pageContext.generateClassName}
          >
            {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
            <MuiThemeProvider
              theme={this._pageContext.theme}
              sheetsManager={this._pageContext.sheetsManager}
            >
              <RouterProvider>
                <Container>
                  <Layout>
                    <RelayProvider
                      environment={environment}
                      variables={pageData && pageData.variables}
                    >
                      <Component
                        {...pageProps}
                        pageContext={this._pageContext}
                        data={pageData && pageData.data}
                        variables={pageData && pageData.variables}
                        operationName={pageData && pageData.operationName}
                        router={router}
                      />
                    </RelayProvider>
                  </Layout>
                </Container>
              </RouterProvider>
            </MuiThemeProvider>
          </JssProvider>
        </EmotionThemeProvider>
      </EnvironmentProvider>
    );
  }
}
