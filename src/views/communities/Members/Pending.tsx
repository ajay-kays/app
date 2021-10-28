import React, { useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useStores, useTheme } from 'store'
import { constants } from 'lib/constants'
import { Contact, DeletableContact, PendingContact } from './Items'

function Pending({ tribe, members }) {
  const { chats, msg } = useStores()

  async function onApproveOrDenyMember(contactId, status) {
    const msgs = msg.messages[tribe.id]
    if (!msgs) return
    const theMsg = msgs.find(
      (m) => m.sender === contactId && m.type === constants.message_types.member_request
    )
    if (!theMsg) return
    await msg.approveOrRejectMember(contactId, status, theMsg.id)
  }

  const renderItem: any = ({ item, index }: any) => (
    <PendingContact key={index} contact={item} onApproveOrDenyMember={onApproveOrDenyMember} />
  )

  return (
    <FlatList
      style={styles.scroller}
      data={members}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
    />
  )
}

export default observer(Pending)

const styles = StyleSheet.create({
  scroller: {
    width: '100%',
    position: 'relative',
  },
})
