import React from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'

import { useStores, useTheme } from '../../../store'
import { useAvatarColor } from '../../../store/hooks/msg'
import { constants } from 'lib/constants'
import { calcExpiry } from './utils'
import Typography from '../../common/Typography'

const received = constants.statuses.received

const encryptedTypes = [constants.message_types.message, constants.message_types.invoice]

export default function InfoBar(props) {
  const { ui } = useStores()
  const theme = useTheme()

  const isMe = props.sender === props.myid

  const isReceived = props.status === received
  const showLock = encryptedTypes.includes(props.type)

  const { expiry, isExpired } = calcExpiry(props)

  const isPaid = props.status === constants.statuses.confirmed
  const hasExpiry = !isPaid && expiry ? true : false

  let senderAlias = props.senderAlias
  const nameColor = useAvatarColor(senderAlias)

  const timeFormat = ui.is24HourFormat ? 'HH:mm A' : 'hh:mm A'
  return (
    <View style={styles.wrap}>
      <View
        style={{
          ...styles.content,
          alignSelf: isMe ? 'flex-end' : 'flex-start',
          flexDirection: isMe ? 'row-reverse' : 'row',
        }}
      >
        <View
          style={{
            ...styles.innerContent,
            flexDirection: isMe ? 'row-reverse' : 'row',
          }}
        >
          {senderAlias && !isMe ? (
            <Typography style={{ ...styles.sender }} size={12} lh={13} color={nameColor}>
              {senderAlias}
            </Typography>
          ) : null}
          <Typography size={12} lh={13} color={theme.darkGrey}>
            {moment(props.date).format(timeFormat)}
          </Typography>
          {showLock && (
            <Icon name='lock' size={14} color='#AFB6BC' style={{ marginRight: 4, marginLeft: 4 }} />
          )}
          {isMe && isReceived ? (
            <Icon
              name='flash'
              size={14}
              color='#64C684'
              style={{ marginRight: showLock ? 0 : 4 }}
            />
          ) : null}
        </View>
        {hasExpiry && !isExpired ? (
          <Typography
            size={10}
            lh={13}
            color={theme.darkGrey}
          >{`Expires in ${expiry} minutes`}</Typography>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    height: 15,
    width: '100%',
    display: 'flex',
  },
  content: {
    marginRight: 8,
    marginLeft: 8,
    maxWidth: 234,
    minWidth: 234,
    display: 'flex',
    justifyContent: 'space-between',
  },
  innerContent: {
    display: 'flex',
  },
  sender: {
    marginRight: 6,
    marginLeft: 6,
  },
})
