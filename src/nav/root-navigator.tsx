import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Chatroom } from 'views/chat'
import Community from 'views/communities/Community'
import { HomePlaceholder } from 'views/home-placeholder'

const Stack = createNativeStackNavigator()

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={HomePlaceholder} />
      <Stack.Screen name='Chat' component={Chatroom} />
      <Stack.Screen name='Community' component={Community} />
    </Stack.Navigator>
  )
}
