import { AppRegistry, LogBox } from 'react-native'
import App from './src/app'

LogBox.ignoreLogs(['Require cycle:', "Can't perform a React", 'EventEmitter.rem'])

AppRegistry.registerComponent('zion', () => App)
