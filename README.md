### Installation

```bash
# Clone the repository
git clone <repository-url>
cd BaroPlate

# Install dependencies
npm install
# or
yarn install

# iOS setup
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android
```

## 🎨 Customization

### App Icon & Splash Screen

```bash
# Update splash screen
yarn react-native generate-bootsplash ./src/assets/images/logo.png \
 --platforms=android,ios,web \
 --background=ffffff \
 --logo-width=100 \
 --assets-output=assets

# Update app icon
npx icon-set-creator create ./src/assets/images/logo.png

# Rename app
npx react-native-rename "4XC-Dashboard" --skipGitStatusCheck
```
