# To enable custom font

- put your fonts here

- run
```console
yarn add global react-native-asset
```

- create file with: 
```javascript
    module.exports = {
    assets: ["./assets/fonts/"],
        dependencies: {
            "react-native-vector-icons": {
                platforms: { ios: null },
            },
        },
    };
```

- run
```console
react-native-asset
```

- edit the function in ./src/theme/typography.ts to use the font