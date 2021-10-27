import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { setTint } from 'views/common/StatusBar'
import Onboard from 'views/onboard'
import Home from 'views/onboard/Home'
import Invite from 'views/onboard/Invite'

const AuthRootStack = createNativeStackNavigator()

export default function Auth() {
  return (
    <AuthRootStack.Navigator initialRouteName='Home'>
      <AuthRootStack.Screen
        name='Home'
        component={Home}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false,
        }}
      />
      <AuthRootStack.Screen
        name='Invite'
        component={Invite}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false,
        }}
      />
      <AuthRootStack.Screen
        name='Onboard'
        component={Onboard}
        listeners={{ focus: () => setTint('dark') }}
        options={{
          headerShown: false,
        }}
      />
    </AuthRootStack.Navigator>
  )
}
