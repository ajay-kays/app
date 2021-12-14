module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          api: './src/api',
          dev: './src/dev',
          lib: './src/lib',
          nav: './src/nav',
          realm: './src/realm',
          services: './src/services',
          store: './src/store',
          theme: './src/theme',
          views: './src/views',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
    'react-native-reanimated/plugin',
  ],
}
