import React, { useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { StyleSheet, View, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { useChats, useChatRow, useSearchChats, useStores, useTheme } from 'store'
import InviteRow, { styles } from './inviteRow'
import { useChatPicSrc } from 'views/utils/picSrc'
import { Avatar, RefreshLoading, Typography } from 'views/common'
import { navigate } from 'nav'
import { display } from 'lib/logging'

function ChatList(props) {
  const { ui, user, contacts, msg, details, chats } = useStores()
  const myid = user.myid

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    })

    setRefreshing(true)
    await contacts.getContacts()
    await msg.getMessages()
    await details.getBalance()
    setRefreshing(false)
  }, [refreshing])

  /**
   * renderItem component
   * @param {object} item - item object getting from map chatToShow array
   * @param {number} index - index of item in the array
   */
  const renderItem: any = ({ item, index }) => {
    const chatID = (item.id || rando()) + ''
    console.log(item)
    // display({
    //   name: 'ChatList renderItem',
    //   preview: `${item.name} - chatID ${chatID}`,
    //   value: { item, chatID },
    // })
    let showInvite = false
    if (item.invite && item.invite.status !== 4) showInvite = true
    if (showInvite) return <InviteRow key={`invite_${index}`} {...item} />
    return <ChatRow key={chatID} {...item} />
  }

  const chatsToUse = useChats()
  const chatsToShow = useSearchChats(chatsToUse)

  return (
    <View style={{ width: '100%', flex: 1 }} accessibilityLabel='chatlist'>
      <FlatList<any>
        data={chatsToShow}
        renderItem={renderItem}
        keyExtractor={(item) => {
          let key
          if (!item.id) {
            const contact_id = item.contact_ids.find((id) => id !== myid)
            key = 'contact_' + String(contact_id)
            // return 'contact_' + String(contact_id)
          } else {
            key = String(item.id)
          }
          // display({
          //   name: 'ChatList keyExtractor',
          //   preview: `${item.name} - ${key}`,
          //   value: { chatsToShow, item, key },
          // })
          return key
          // return String(item.id)
        }}
        // This causes a blank screen on Android:
        refreshControl={<RefreshLoading refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={props.listHeader}
      />
    </View>
  )
}

function ChatRowFC(props) {
  const { id, name, date, contact_ids } = props
  const navigation = useNavigation()
  const { msg, user } = useStores()

  const onSeeChatHandler = () => {
    requestAnimationFrame(() => {
      msg.seeChat(props.id)
      msg.getMessages()
      navigate('Chat', { ...props })
    })
  }

  const theme = useTheme()
  let uri = useChatPicSrc(props)
  const hasImg = uri ? true : false

  const { lastMsgText, lastMsgDate, hasLastMsg, unseenCount, hasUnseen } = useChatRow(props.id)

  const w = Math.round(Dimensions.get('window').width)
  return (
    <TouchableOpacity
      style={{
        ...styles.chatRow,
        backgroundColor: theme.main,
      }}
      activeOpacity={0.5}
      onPress={onSeeChatHandler}
    >
      <View style={styles.avatarWrap}>
        <Avatar alias={name} photo={uri && uri} size={50} aliasSize={18} big />
      </View>
      <View style={{ ...styles.chatContent }}>
        <View style={styles.top}>
          <Typography size={16} fw='500'>
            {name}
          </Typography>
          <Typography size={13} style={{ ...styles.chatDate }} color={theme.subtitle}>
            {lastMsgDate}
          </Typography>
        </View>
        <View style={styles.bottom}>
          {hasLastMsg && (
            <Typography
              numberOfLines={1}
              color={theme.subtitle}
              fw={hasUnseen ? '500' : '400'}
              size={13}
              style={{
                maxWidth: w - 150,
              }}
            >
              {lastMsgText}
            </Typography>
          )}
          {hasUnseen ? (
            <View style={{ ...moreStyles.badge, backgroundColor: theme.green }}>
              <Typography color={theme.white} size={12}>
                {unseenCount}
              </Typography>
            </View>
          ) : null}
        </View>
        <View style={{ ...styles.borderBottom, borderBottomColor: theme.border }}></View>
      </View>
    </TouchableOpacity>
  )
}

export default observer(ChatList)
const ChatRow = observer(ChatRowFC)

const moreStyles = StyleSheet.create({
  buttonsWrap: {
    marginTop: 40,
    marginBottom: 25,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  badgeWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  badge: {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginRight: 14,
  },
})

function rando() {
  return Math.random().toString(36).substring(7)
}
