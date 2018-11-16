/* @flow */
import * as colors from '@material-ui/core/colors';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const themeVariables = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  borderRadius: {
    paper: 8,
    control: 4,
  },
};

export const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  fontFamily: themeVariables.fontFamily,
});

export const theme = {
  // system-components specific theme here
  colors: {
    ...colors,
    ...muiTheme.palette,
  },
  shape: muiTheme.shape,
  shadows: muiTheme.shadows,
  breakpoints: ['32em', '48em', '64em', '80em'],
  space: [0, 4, 8, 16, 32, 64, 128],
  fonts: {
    sans: themeVariables.fontFamily,
    mono:
      'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72, 96],
  lineHeight: [12, 14, 16, 20, 24, 32, 48, 64, 72, 96],
  fontWeights: {
    light: 200,
    normal: 400,
    bold: 700,
  },
  maxWidths: ['100%', 960, 1200],
  radii: [0, 2, 4],
};
