import React from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useStores } from 'store'
import { useNavigation } from '@react-navigation/core'

export const ChatList = observer(() => {
  const { navigate } = useNavigation()
  const { chats } = useStores()
  return (
    <View>
      <Text>Tribe Chats:</Text>
      {chats.chatsArray.map((chat) =>
        chat.type === 2 ? (
          <TouchableOpacity
            key={chat.id}
            onPress={() => {
              navigate('Chat' as never, { chatId: chat.id } as never)
            }}
            style={{ padding: 5 }}
          >
            <Text>
              {chat.id} - {chat.name}
            </Text>
          </TouchableOpacity>
        ) : null
      )}
    </View>
  )
})
