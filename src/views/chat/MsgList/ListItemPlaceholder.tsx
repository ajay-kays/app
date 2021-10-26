import React from 'react'
import { Text, View } from 'react-native'

export const ListItem = ({ msg }) => {
  const message = msg
  if (message.type !== 0) return null
  return (
    <View key={message.id} style={{ marginVertical: 3 }}>
      <Text>
        {message.id}:{message.type} - {message.message_content}
      </Text>
    </View>
  )
}
