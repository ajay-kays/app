import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from 'store'
import { Chatroom as Chat } from 'views/chat'
import Community from 'views/communities/Community'
import { Communities } from 'views/communities'
// import Chats from '../chat/Chats'
// import Chat from '../chat/chat'
// import ChatDetails from '../chat/ChatDetails'
// import Account from '../Account/Navigation'
// import Payment from '../Payment'
// import AddSats from '../Payment/AddSats'
// import Contacts from '../Contacts'
// import Contact from '../Contacts/Contact'
// import Tribes from '../Tribes'
// import DiscoverTribes from '../Tribes/Discover'
// import Tribe from '../Tribes/Tribe'
// import EditTribe from '../Tribes/Tribe/EditTribe'
// import TribeMembers from '../Tribes/Members'
import { setTint } from 'views/common/StatusBar'

const RootStack = createNativeStackNavigator()

export default function Root() {
  const theme = useTheme()

  return (
    <RootStack.Navigator initialRouteName='Communities'>
      {/* <RootStack.Screen
        name='Chats'
        component={Chats}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      /> */}
      <RootStack.Screen
        name='Chat'
        component={Chat}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      {/* <RootStack.Screen
        name='ChatDetails'
        component={ChatDetails}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      /> */}
      {/* <RootStack.Screen
        name='Payment'
        component={Payment}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      /> */}
      {/* <RootStack.Screen
        name='AddSats'
        component={AddSats}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      /> */}
      {/* <RootStack.Screen
        name='Account'
        component={Account}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      /> */}

      {/* <RootStack.Screen
        name='Contacts'
        component={Contacts}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      /> */}
      {/* <RootStack.Screen
        name='Contact'
        component={Contact}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      /> */}
      <RootStack.Screen
        name='Communities'
        component={Communities}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
          // animationEnabled: false,
        }}
      />
      {/* <RootStack.Screen
        name='DiscoverTribes'
        component={DiscoverTribes}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      /> */}
      <RootStack.Screen
        name='Community'
        component={Community}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      />
      {/* <RootStack.Screen
        name='EditTribe'
        component={EditTribe}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      /> */}
      {/* <RootStack.Screen
        name='TribeMembers'
        component={TribeMembers}
        listeners={{ focus: () => setTint(theme.dark ? 'dark' : 'light') }}
        options={{
          headerShown: false,
        }}
      /> */}
    </RootStack.Navigator>
  )
}
