/* @flow */

import { injectGlobal } from 'emotion';
import { normalize } from 'polished';
import { theme } from './theme';

export const injectGlobalStyle = () =>
  injectGlobal`
    ${normalize()}

    body, html {
      margin: 0;
      height: 100%;
    }

    html {
      -webkit-font-smoothing: antialiased;
      box-sizing: border-box;
      overflow-y: scroll;
      font-family: ${theme.fonts.sans};
    }

    body {
      background-color: ${theme.colors.background.default};
    }

    *, *:before, *:after {
      box-sizing: inherit;
    }

    #__next {
      min-height: 100%;
      display: flex;
    }
  `;
