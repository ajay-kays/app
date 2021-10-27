import React, { useEffect } from 'react'
import { Button, Text, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { skipLogin } from 'dev/skipLogin'
import { useStores } from 'store'
// import { ChatList } from 'views/chat/ChatList'
import { Communities } from 'views/communities'
import { sleep } from 'lib/sleep'

export const HomePlaceholder = observer(() => {
  const { chats, contacts, details, meme, msg } = useStores()
  useEffect(() => {
    skipLogin()
    // Fetch messages
  }, [])
  const fetchStuff = async () => {
    contacts.getContacts()
    msg.getMessages()
    await sleep(500)
    details.getBalance()
    await sleep(500)
    meme.authenticateAll()
  }
  // if (chats.chatsArray.length > 0) return <ChatList />
  if (chats.chatsArray.length > 0) return <Communities />
  return (
    <View
      style={{ flex: 1, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={{ color: 'white', marginBottom: 30, fontSize: 24 }}>Zion</Text>
      <Button title='Log in' onPress={fetchStuff} />
    </View>
  )
})
