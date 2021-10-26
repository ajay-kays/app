import React from 'react'
import { useStores } from 'store'
import { useMsgSender } from 'store/hooks'
import { DateLine } from './DateLine'
import Message from '../msg'

export const ListItem = React.memo(
  ({
    m,
    chat,
    isGroup,
    isTribe,
    onDelete,
    myPubkey,
    myAlias,
    windowWidth,
    onApproveOrDenyMember,
    onDeleteChat,
    onBoostMsg,
    myid,
  }: IListItem) => {
    const { contacts } = useStores()

    const { senderAlias, senderPic } = useMsgSender(m, contacts.contactsArray, isTribe)

    if (m.dateLine) {
      return <DateLine dateString={m.dateLine} />
    }

    // SKIPPING - this needs to be MST'ized
    const msg = m
    // if (!m.chat) msg.chat = chat

    return (
      <Message
        {...msg}
        chat={chat}
        isGroup={isGroup}
        isTribe={isTribe}
        senderAlias={senderAlias}
        senderPic={senderPic}
        onDelete={onDelete}
        myPubkey={myPubkey}
        myAlias={myAlias}
        myid={myid}
        windowWidth={windowWidth}
        onApproveOrDenyMember={onApproveOrDenyMember}
        onDeleteChat={onDeleteChat}
        onBoostMsg={onBoostMsg}
      />
    )
  }
)

type IListItem = {
  m: any
  chat: any
  isGroup: any
  isTribe: any
  onDelete: any
  myPubkey: any
  myAlias: any
  windowWidth: any
  onApproveOrDenyMember: any
  onDeleteChat: any
  onBoostMsg: any
  myid: any
}
