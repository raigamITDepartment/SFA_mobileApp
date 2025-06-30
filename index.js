import { AppRegistry } from 'react-native';
import App from './app/index'; // points to your app/index.tsx
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);