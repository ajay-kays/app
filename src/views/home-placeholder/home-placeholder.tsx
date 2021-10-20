import React, { useEffect } from 'react'
import { Button, Text, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { skipLogin } from 'dev/skipLogin'
import { useStores } from 'store'
import { ChatList } from 'views/chat/ChatList'

export const HomePlaceholder = observer(() => {
  const { chats, contacts, msg } = useStores()
  useEffect(() => {
    skipLogin()
    // Fetch messages
  }, [])
  const fetchStuff = () => {
    contacts.getContacts()
    msg.getMessages()
  }
  if (chats.chatsArray.length > 0) return <ChatList />
  return (
    <View
      style={{ flex: 1, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={{ color: 'white', marginBottom: 30, fontSize: 24 }}>Zion</Text>
      <Button title='Log in' onPress={fetchStuff} />
    </View>
  )
})
