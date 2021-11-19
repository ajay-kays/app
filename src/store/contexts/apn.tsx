import React, { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import * as PushNotification from 'react-native-push-notification'
// import PushNotificationIOS from '@react-native-community/push-notification-ios'

export const APNContext = React.createContext({
  token: '',
  configure: (callback, finishCallback) => {},
})

export const useApn = () => React.useContext(APNContext)

export default function APNManager(props) {
  const [token, setToken] = useState('')

  const configure = (callback, finishCallback) => {
    if (Platform.OS === 'ios') {
      console.log('configuring...')
      PushNotification.configure({
        onRegister: function ({ token, os }) {
          setToken(token)
          if (callback) callback(token)
        },
        onNotification: function (notification) {
          const badge = notification.data.aps.badge
          console.log('onNotification?', notification)
          finishCallback(notification)
          console.log('badge?', badge)
        },
        onError: (error) => {},
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
      })
    } else {
      console.log('Skipping push notification registration')
    }
  }

  return (
    <APNContext.Provider
      value={{
        configure,
        token,
      }}
    >
      {props.children}
    </APNContext.Provider>
  )
}
