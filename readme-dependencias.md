npx react-native init meetapp

yarn add eslint -D

yarn eslint --init

rm package-lock.json

yarn

yarn add prettier eslint-config-prettier eslint-plugin-prettier babel-eslint -D

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

yarn add react-native-linear-gradient

**somente no mac**

```
cd ios
pod install
..
```

yarn add styled-components

yarn add prop-types

yarn add react-native-vector-icons

yarn add reactotron-react-native reactotron-redux reactotron-redux-saga

yarn add redux redux-saga react-redux

yarn add redux-persist immer

yarn add axios

yarn add date-fns@next

yarn add date-fns-tz

yarn add yup

yarn add formik@2.0
