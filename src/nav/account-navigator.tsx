import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme, useStores } from 'store'
import { setTint } from 'views/common/StatusBar'
import {
  Account,
  AccountDetails,
  Appearance,
  Network,
  PublicKey,
  Security,
  Support,
} from 'views/account'

const Stack = createNativeStackNavigator()

export default function Navigation() {
  const theme = useTheme()
  const { user } = useStores()

  return (
    <Stack.Navigator initialRouteName={user.isPinChanged ? 'Security' : 'AccountMain'}>
      <Stack.Screen
        name='AccountMain'
        component={Account}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Settings'
        component={AccountDetails}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Network'
        component={Network}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Security'
        component={Security}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name='Appearance'
        component={Appearance}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='QRCode'
        component={PublicKey}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name='Support'
        component={Support}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
