import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Chatroom } from 'views/chat'
import { HomePlaceholder } from 'views/home-placeholder'

const Stack = createNativeStackNavigator()

export const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomePlaceholder} />
      <Stack.Screen name='Chatroom' component={Chatroom} />
    </Stack.Navigator>
  )
}
