import nodeResolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';

export default ['en-US', 'fr', 'de'].map(locale => ({
  input: require.resolve(`date-fns/esm/locale/${locale}`),
  output: {
    file: `./locales/${locale.split('-')[0]}.js`,
    format: 'iife',
    name: 'i18nLocale',
  },
  plugins: [nodeResolve(), uglify()],
}));
