import React, { useState } from 'react'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Clipboard from '@react-native-community/clipboard'
import { IconButton } from 'react-native-paper'

import { useTheme } from 'store'
import { verifyPubKey } from './utils'

export default function Popup(props) {
  const { isMe, messageContent, onRequestCloseHandler, onBoostHandler, onDelete } = props
  const [deleting, setDeleting] = useState(false)
  const theme = useTheme()
  const { isPubKey, pubKey } = verifyPubKey(messageContent)

  const allowBoost = !isMe && !(messageContent || '').startsWith('boost::')

  const onCopyHandler = () => {
    Clipboard.setString(messageContent || '')
    onRequestCloseHandler()
  }

  const onPubCopyHandler = () => {
    Clipboard.setString(pubKey || '')
    onRequestCloseHandler()
  }

  const onDeleteHandler = async () => {
    if (!deleting) {
      setDeleting(true)
      await onDelete(props.id)
      setDeleting(false)
      onRequestCloseHandler()
    }
  }

  return (
    <>
      {allowBoost && (
        <IconButton
          onPress={onBoostHandler}
          icon={() => <Ionicon name='rocket' color={theme.primary} size={20} />}
          style={{
            backgroundColor: theme.lightGrey,
            marginHorizontal: 14,
          }}
        />
      )}

      {isPubKey && (
        <IconButton
          onPress={onPubCopyHandler}
          icon={() => <Ionicon name='qr-code' color={theme.blue} size={18} />}
          style={{
            backgroundColor: theme.lightGrey,
            marginHorizontal: 14,
          }}
        />
      )}
      <IconButton
        onPress={onCopyHandler}
        icon={() => <Ionicon name='copy' color={theme.darkGrey} size={20} />}
        style={{
          backgroundColor: theme.lightGrey,
          marginHorizontal: 14,
        }}
      />

      {(isMe || props.isTribeOwner) && (
        <IconButton
          onPress={onDeleteHandler}
          icon={() => <Ionicon name='trash' color={theme.red} size={20} />}
          color={theme.red}
          style={{
            backgroundColor: theme.lightGrey,
            marginHorizontal: 14,
          }}
        />
      )}
    </>
  )
}
