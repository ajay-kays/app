import React, { useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from 'store'
import { MsgList } from '../MsgList'
import { useRoute } from '@react-navigation/core'

const ChatroomFC = () => {
  const route = useRoute<any>() // ChatRouteProp
  const chatID = route.params.chatId
  const { chats, msg } = useStores()
  const msgs = msg.messages2.get(chatID)
  const chat = useMemo(
    () => chats.chatsArray.find((c) => c.id === chatID) || route.params,
    [chatID, chats.chats, route.params]
  )
  const [pricePerMessage, setPricePerMessage] = useState(0)
  return <MsgList chat={chat} msgs={msgs} pricePerMessage={pricePerMessage} />
}

export const Chatroom = observer(ChatroomFC)
