import React from 'react'
import { observer } from 'mobx-react-lite'
import { display } from 'lib/logging'
import { useStores } from 'store'
import { Text, View } from 'react-native'

const ChatroomFC = (props) => {
  const chatId = props.route?.params?.chatId
  const { msg } = useStores()
  const msgs = msg.messages2.get(chatId)
  // display({ name: 'Chatroom', preview: `Chat ID ${chatId}`, value: { props, chatId, msgs } })
  return (
    <View>
      {msgs?.map((message) => (
        <View key={message.id} style={{ marginVertical: 3 }}>
          <Text>
            {message.id} - {message.type} - {message.message_content}
          </Text>
        </View>
      ))}
    </View>
  )
}

export const Chatroom = observer(ChatroomFC)
