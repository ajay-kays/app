import React, { useCallback, useState } from 'react'
import { useNavigation } from '@react-navigation/core'
import Toast from 'react-native-simple-toast'
import { useStores } from 'store'
import { MsgListFC } from './MsgListFC'

export const MsgListWrap = ({
  chat,
  msgs,
  pricePerMessage,
}: {
  chat: any // Chat
  msgs: any
  pricePerMessage: number
}) => {
  const { msg, user, chats, details } = useStores()
  const [limit, setLimit] = useState(40)
  const navigation = useNavigation()

  function onLoadMoreMsgs() {
    setLimit((c) => c + 40)
  }

  const onBoostMsg = useCallback(
    async (m) => {
      const { uuid } = m
      if (!uuid) return
      const amount = (user.tipAmount || 100) + pricePerMessage

      if (amount > details.balance) {
        Toast.showWithGravity('Not Enough Balance', Toast.SHORT, Toast.TOP)
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
    await chats.exitGroup(chat.id)
  }, [chat.id, chats, navigation])

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
