import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { useStores, useTheme } from '../../../store'
import { constants } from 'lib/constants'
import Typography from '../../common/Typography'
import { reportError } from 'lib/errorHelper'

export default function GroupNotification(props) {
  const { contacts } = useStores()
  const theme = useTheme()

  let senderAlias = 'Unknown'
  if (props.isTribe) {
    senderAlias = props.sender_alias
  } else {
    const sender = contacts.contactsArray.find((c) => c.id === props.sender)
    if (sender) {
      senderAlias = sender && sender.alias
    } else {
      console.log('???')
      reportError('GroupNotification error..?!')
    }
  }

  const isJoin = props.type === constants.message_types.group_join

  return (
    <View style={styles.wrap}>
      <View
        style={{
          ...styles.content,
          backgroundColor: theme.main,
        }}
      >
        <Typography size={12} color={theme.subtitle}>
          {`${senderAlias} has ${isJoin ? 'joined' : 'left'} the group`}
        </Typography>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    height: 22,
    width: '100%',
    marginTop: 30,
  },
  content: {
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 15,
  },
})
