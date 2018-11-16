/* @flow */

declare module 'emotion-theming' {
  declare export class ThemeProvider extends React$Component<{|
    theme: Object,
    children: React$Node,
  |}> {}

  declare export function withTheme<T>(
    T
  ): React$ComponentType<$Diff<React$ElementConfig<T>, { theme: Object }>>;
}
