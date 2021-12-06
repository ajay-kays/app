import React, { useCallback, useState } from 'react'
import { useNavigation } from '@react-navigation/core'
import Toast from 'react-native-simple-toast'
import { useMsgs, useStores } from 'store'
import { MsgListFC } from './MsgListFC'
import { sleep } from 'lib/sleep'
import { Alert } from 'react-native'
import { display } from 'lib/logging'
import { reportError } from 'lib/errorHelper'

export const MsgListWrap = ({
  chat,
  pricePerMessage,
}: {
  chat: any // Chat
  pricePerMessage: number
}) => {
  const { msg, user, chats, details } = useStores()
  const [limit, setLimit] = useState(40)
  const navigation = useNavigation()

  console.log(`chat.id ${chat.id} limit: ${limit}`)

  function onLoadMoreMsgs() {
    setLimit((c) => c + 40)
    // First let's see if the limit exceeds the number of messages we have.
    // If so, query the backend with some offset or limit
    msg.getMessagesForChat(chat.id, limit)
  }

  const onBoostMsg = useCallback(
    async (m) => {
      const { uuid } = m
      if (!uuid) return
      const amount = (user.tipAmount || 100) + pricePerMessage

      if (amount > details.balance) {
        Toast.showWithGravity('Not Enough Balance', Toast.SHORT, Toast.TOP)
        await sleep(1000)
        return
      }

      msg.sendMessage({
        boost: true,
        contact_id: null,
        text: '',
        amount,
        chat_id: chat.id || null,
        reply_uuid: uuid,
        message_price: pricePerMessage,
      })

      Toast.showWithGravity('Boosted!', Toast.LONG, Toast.CENTER)
    },
    [chat.id, details.balance, msg, pricePerMessage, user.tipAmount]
  )

  const onDelete = useCallback(
    async (id) => {
      await msg.deleteMessage(id)
    },
    [msg]
  )

  const onApproveOrDenyMember = useCallback(
    async (contactId, status, msgId) => {
      await msg.approveOrRejectMember(contactId, status, msgId)
    },
    [msg]
  )

  const onDeleteChat = useCallback(async () => {
    navigation.navigate('Home' as never, { params: { rnd: Math.random() } } as never)
    try {
      await chats.exitGroup(chat.id)
    } catch (e) {
      reportError(e)
    }
  }, [chat.id, chats, navigation])

  const msgs = useMsgs(chat, limit)

  try {
    if (!msgs || (msgs && msgs.length === 0)) {
      display({
        name: 'MsgListWrap',
        preview: `Fetching messages for chat ID ${chat.id}`,
        important: true,
        value: { chat, msgs, pricePerMessage, chatID: chat.id },
      })
      msg.getMessagesForChat(chat.id)
    }
  } catch (e) {
    reportError(e)
  }

  return (
    <MsgListFC
      msgsLength={(msgs && msgs.length) || 0}
      msgs={msgs}
      chat={chat}
      onDelete={onDelete}
      myPubkey={user.publicKey}
      myAlias={user.alias}
      myid={user.myid}
      onApproveOrDenyMember={onApproveOrDenyMember}
      onDeleteChat={onDeleteChat}
      onLoadMoreMsgs={onLoadMoreMsgs}
      onBoostMsg={onBoostMsg}
    />
  )
}
