npx react-native init meetapp

yarn add eslint -D

yarn eslint --init

rm package-lock.json

yarn

yarn add prettier eslint-config-prettier eslint-plugin-prettier babel-eslint -D

yarn add reactotron-react-native

yarn add react-navigation react-native-gesture-handler

yarn add babel-plugin-root-import eslint-import-resolver-babel-plugin-root-import -D

> alterar o arquivo babel.config.js

```
module.exports = {
presets: ['module:metro-react-native-babel-preset'],
plugins: [
  [
    'babel-plugin-root-import',
    {
      rootPathSuffix: 'src',
    },
  ],
],
};
```

> criar o arquivo jsconfig.json

```
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "~/*": ["*"]
    }
  }
}
```
