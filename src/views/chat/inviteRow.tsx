import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Image, Alert } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'
import Toast from 'react-native-simple-toast'
import { constantCodes } from 'lib/constants'
import { useStores, useTheme } from 'store'
import { Typography } from 'views/common'

export default function InviteRow(props) {
  const theme = useTheme()
  const { contacts, ui, details } = useStores()
  const { name, invite } = props
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const statusString = constantCodes['invite_statuses'][invite.status]

  const expiredStatus = props.invite.status === 5
  const yesterday = moment().utc().add(-24, 'hours')
  const isExpired = moment(invite.created_at || new Date())
    .utc()
    .isBefore(yesterday)
  if (isExpired || expiredStatus) return <></>

  const actions = {
    payment_pending: () => {
      if (!confirmed) {
        Alert.alert('Pay for invitation?', '', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'Confirm', onPress: () => onConfirmHandler() },
        ])
      }
    },
    ready: () => ui.setShareInviteModal(invite.invite_string),
    delivered: () => ui.setShareInviteModal(invite.invite_string),
  }
  function doAction() {
    if (actions[statusString]) actions[statusString]()
  }

  async function onConfirmHandler() {
    const balance = details.balance
    if (balance < invite.price) {
      Toast.showWithGravity('Not Enough Balance', Toast.SHORT, Toast.TOP)
    } else {
      setLoading(true)
      await contacts.payInvite(invite.invite_string)
      setConfirmed(true)
      setLoading(false)
    }
  }

  // console.log('props', props)

  return (
    <TouchableOpacity
      style={{
        ...styles.chatRow,
        backgroundColor: theme.main,
        ...styles.borderBottom,
        borderBottomColor: theme.border,
      }}
      activeOpacity={0.5}
      onPress={doAction}
    >
      <View style={styles.avatarWrap}>
        <Image style={{ height: 40, width: 40 }} source={require('../../assets/invite-qr.png')} />
      </View>
      <View style={styles.inviteContent}>
        <View style={styles.top}>
          <Typography color={theme.primary} size={16}>{`Invite: ${name}`}</Typography>
          {invite.price && (
            <Typography style={{ marginRight: 14 }} color={theme.darkGrey}>
              {invite.price}
            </Typography>
          )}
        </View>
        <View style={styles.inviteBottom}>
          {inviteIcon(statusString, theme)}
          <Typography color={theme.subtitle}>{inviteMsg(statusString, name, confirmed)}</Typography>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function inviteIcon(statusString, theme) {
  switch (statusString) {
    case 'payment_pending':
      return (
        <MaterialIcon name='credit-card' size={14} color={theme.icon} style={{ marginRight: 4 }} />
      )
    case 'ready':
      return <MaterialIcon name='check' size={14} color={theme.icon} style={{ marginRight: 4 }} />
    case 'delivered':
      return <MaterialIcon name='check' size={14} color={theme.icon} style={{ marginRight: 4 }} />
    default:
      return <></>
  }
}

function inviteMsg(statusString: string, name: string, confirmed?: boolean) {
  switch (statusString) {
    case 'pending':
      return `${name} is on the waitlist`
    case 'payment_pending':
      return confirmed ? 'Awaiting confirmation...' : 'Tap to pay and activate the invite'
    case 'ready':
      return 'Ready! Tap to share. Expires in 24 hours'
    case 'delivered':
      return 'Ready! Tap to share. Expires in 24 hours'
    case 'in_progress':
      return `${name} is signing on`
    case 'expired':
      return 'Expired'
    default:
      return 'Signup complete'
  }
}

export const styles = StyleSheet.create({
  chatRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  borderBottom: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
  },
  chatContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 16,
    paddingTop: 16,
  },
  inviteContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 16,
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    maxHeight: 28,
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inviteBottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    width: 70,
    height: 80,
  },
  chatDate: {
    marginRight: 14,
  },
  cancel: {
    color: 'red',
  },
})
