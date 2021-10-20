import React from 'react'
import { Text, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useStores } from 'store'

export const ChatList = observer(() => {
  const { chats } = useStores()
  return (
    <View>
      <Text>Tribe Chats:</Text>
      {chats.chatsArray.map((chat) =>
        chat.type === 2 ? (
          <Text key={chat.id}>
            {chat.id} - {chat.name}
          </Text>
        ) : null
      )}
    </View>
  )
})
