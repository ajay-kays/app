import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from 'store'
import { Chatroom as Chat, ChatDetails, Chats } from 'views/chat'
import {
  Communities,
  Community,
  CommunityMembers,
  DiscoverCommunities,
  EditCommunity,
} from 'views/communities'
import { Contact, Contacts } from 'views/contacts'
import { AddSats, Payment } from 'views/payment'
import AccountNavigator from 'nav/account-navigator'
import { setTint } from 'views/common/StatusBar'

const RootStack = createNativeStackNavigator()

export default function Root() {
  const theme = useTheme()

  return (
    <RootStack.Navigator initialRouteName='Communities'>
      <RootStack.Screen
        name='Chats'
        component={Chats}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          // animationEnabled: false,
        }}
      />
      <RootStack.Screen
        name='Chat'
        component={Chat}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='ChatDetails'
        component={ChatDetails}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='Payment'
        component={Payment}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          // animationEnabled: false,
        }}
      />
      <RootStack.Screen
        name='AddSats'
        component={AddSats}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='Account'
        component={AccountNavigator}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          // animationEnabled: false,
        }}
      />
      <RootStack.Screen
        name='Contacts'
        component={Contacts}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='Contact'
        component={Contact}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='Communities'
        component={Communities}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          // animationEnabled: false,
        }}
      />
      <RootStack.Screen
        name='DiscoverCommunities'
        component={DiscoverCommunities}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='Community'
        component={Community}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='EditCommunity'
        component={EditCommunity}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name='CommunityMembers'
        component={CommunityMembers}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
    </RootStack.Navigator>
  )
}
