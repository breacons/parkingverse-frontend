const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackPlugin,
  useBabelRc,
// eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('customize-cra');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getThemeVariables } = require('antd/dist/theme');

module.exports = override((config, env) => {
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  })(config, env);
  useBabelRc()(config, env);
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: getThemeVariables({
      dark: true, // Enable dark mode
      compact: false, // Enable compact mode
    }),
  })(config, env);

  return config;
});
