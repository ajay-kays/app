import { AppRegistry, LogBox } from 'react-native'
import App from './src/app'
import TrackPlayer from 'react-native-track-player'

LogBox.ignoreLogs(['Require cycle:', "Can't perform a React", 'EventEmitter.rem'])

AppRegistry.registerComponent('zion', () => App)
TrackPlayer.registerPlaybackService(() => require('./src/views/podcast/Service'))
