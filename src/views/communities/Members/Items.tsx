import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { RadioButton } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { SwipeRow } from 'react-native-swipe-list-view'
import { IconButton } from 'react-native-paper'
import { useTheme } from '../../../store'
import { usePicSrc } from '../../utils/picSrc'
import { ApproveButton, RejectButton } from '../../chat/msg/memberRequest'
import Avatar from '../../common/Avatar'
import Typography from '../../common/Typography'

export function DeletableContact(props) {
  const theme = useTheme()
  const { contact, onDelete } = props
  const uri = usePicSrc(contact)
  const hasImg = uri ? true : false

  return (
    <SwipeRow disableRightSwipe={true} friction={100} rightOpenValue={-80} stopRightSwipe={-80}>
      <View style={styles.backSwipeRow}>
        <IconButton
          icon='trash-can-outline'
          color='white'
          size={25}
          onPress={() => onDelete(contact.id)}
          style={{ marginRight: 20 }}
        />
      </View>
      <View style={{ ...styles.frontSwipeRow, backgroundColor: theme.bg }}>
        <View style={{ ...styles.avatarWrap }}>
          <Avatar size={40} aliasSize={16} photo={uri} alias={contact.alias} />
        </View>
        <View style={styles.contactContent}>
          <Typography size={16}>{contact.alias}</Typography>
        </View>
      </View>
    </SwipeRow>
  )
}

export function Contact(props) {
  const theme = useTheme()
  const { contact, onPress, selected, unselectable } = props
  const uri = usePicSrc(contact)
  const hasImg = uri ? true : false
  return (
    <TouchableOpacity
      style={{ ...styles.contactTouch, backgroundColor: theme.bg }}
      activeOpacity={1}
      onPress={onPress}
    >
      <View style={{ ...styles.avatarWrap, borderColor: theme.border }}>
        <Avatar size={40} aliasSize={16} photo={uri} big alias={contact.alias} />

        {/* <Image source={hasImg ? { uri } : require('../../../../android_assets/avatar.png')} style={{ width: 44, height: 44 }} resizeMode={'cover'} /> */}
      </View>
      <View style={styles.contactContent}>
        <Typography size={16}>{contact.alias}</Typography>
        {/* <Text style={{ ...styles.contactName, color: theme.title }}>{contact.alias}</Text> */}
      </View>
      <View style={styles.checker}>
        {!unselectable && (
          <RadioButton
            status={selected ? 'checked' : 'unchecked'}
            value='contact'
            color={theme.primary}
            onPress={onPress}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

export function PendingContact(props) {
  const theme = useTheme()
  const [loadingStatus, setLoadingStatus] = useState('')
  const { contact, onPress, selected, unselectable } = props
  const uri = usePicSrc(contact)
  const hasImg = uri ? true : false
  async function press(status: string) {
    if (loadingStatus) return
    setLoadingStatus(status)
    await props.onApproveOrDenyMember(contact.id, status)
    setLoadingStatus('')
  }
  return (
    <TouchableOpacity
      style={{ ...styles.contactTouch, backgroundColor: theme.bg }}
      activeOpacity={1}
      onPress={onPress}
    >
      <View style={{ ...styles.avatarWrap, borderColor: theme.border }}>
        <Avatar size={40} photo={uri} big alias={contact.alias} aliasSize={20} />
      </View>
      <View style={styles.contactContent}>
        <Typography size={16}>{contact.alias}</Typography>
      </View>
      <View style={styles.buttonz}>
        <ApproveButton
          disabled={loadingStatus}
          onPress={() => press('approved')}
          loading={loadingStatus === 'approved'}
        />
        <RejectButton
          disabled={loadingStatus}
          onPress={() => press('rejected')}
          loading={loadingStatus === 'rejected'}
        />
      </View>
    </TouchableOpacity>
  )
}

export function SelectedContact({ contact, onPress, removable }) {
  const theme = useTheme()
  const uri = usePicSrc(contact)
  const hasImg = uri ? true : false
  return (
    <View style={{ ...styles.selectedContact, backgroundColor: theme.bg }}>
      <View style={{ ...styles.selAvatar, borderColor: theme.border }}>
        {/* <Image source={hasImg ? { uri } : require('../../../../android_assets/avatar.png')} style={{ width: 54, height: 54, borderRadius: 27 }} resizeMode={'cover'} /> */}
        {removable && (
          <TouchableOpacity style={styles.tinyButton} onPress={onPress}>
            <Icon name='close' color='white' size={14} />
          </TouchableOpacity>
        )}
      </View>
      <Typography size={16}>{contact.alias}</Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  avatarWrap: {
    marginRight: 18,
    marginLeft: 18,
  },
  contactTouch: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    alignItems: 'center',
    width: '100%',
  },
  contactContent: {
    flex: 1,
  },
  contactName: {
    marginRight: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  checker: {
    width: 60,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContact: {
    width: 80,
    height: 90,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selName: {
    fontSize: 11,
    width: '100%',
    textAlign: 'center',
  },
  selAvatar: {
    position: 'relative',
  },
  tinyButton: {
    height: 18,
    width: 18,
    borderRadius: 9,
    backgroundColor: '#6289FD',
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backSwipeRow: {
    backgroundColor: '#DB5554',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  frontSwipeRow: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
  },
  buttonz: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 100,
    width: 100,
    minWidth: 100,
    marginRight: 12,
  },
})
