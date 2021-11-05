import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react-lite'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useStores, useTheme } from 'store'
import { Chat } from 'store/chats-store'
import { contactForConversation } from './utils'
import { constants } from 'lib/constants'
import { RouteStatus } from './chat'
import { Avatar, Typography } from 'views/common'
import { useMemoizedIncomingPaymentsFromPodcast } from 'store/hooks'
import { useChatPicSrc } from 'views/utils/picSrc'
import { transformPayments } from 'views/utils/payments/transformPayments'
import { navigate } from 'nav'

const conversation = constants.chat_types.conversation

type HeaderProps = {
  chat: Chat
  appMode: boolean
  setAppMode: Function
  status: RouteStatus
  tribeParams: {
    [k: string]: any
  }
  pricePerMinute: number
  podId?: string
}

const Header = ({ chat, status, tribeParams, podId, pricePerMinute }: HeaderProps) => {
  const { contacts, user, details, chats } = useStores()
  const isTribeAdmin = tribeParams && tribeParams.owner_pubkey === user.publicKey
  const theme = useTheme()
  const navigation = useNavigation()

  const [payments, setPayments] = useState([])

  useEffect(() => {
    chats.getCommunities()
    ;(async () => {
      const ps = await details.getPayments()
      setPayments(ps)
    })()
  }, [])

  const theChat = chats.chatsArray.find((c) => c.id === chat.id)

  let contact
  if (chat && chat.type === conversation) {
    contact = contactForConversation(chat, contacts.contactsArray, user.myid)
  }

  function onChatInfoPress() {
    if (chat.type === conversation) {
      if (contact) navigate('Contact', { contact: { ...contact } })
    } else {
      navigate('ChatDetails', {
        group: { ...theChat, ...tribeParams, pricePerMinute },
      })
    }
  }

  function onChatTitlePress() {
    if (chat.type === conversation) {
      if (contact) {
        navigation.goBack()
      }
    } else {
      const uuid = chat?.uuid
      const tribe = chats.communities.get(uuid)
      // const tribe = tribes.find((t) => t.chat?.uuid === chat?.uuid)
      navigate('Tribe', { tribe: { ...tribe } })
    }
  }

  const name = (chat && chat.name) || (contact && contact.alias)

  function onBackPress() {
    requestAnimationFrame(() => {
      // msg.seeChat(chat.id)
      details.getBalance()
      navigation.goBack()
    })
  }

  let uri = useChatPicSrc(chat)

  // TODO: as you can see currently we have two different ways to fetch the total amount spend in a tribe, it should be unified
  const { earned, spent } = useMemoizedIncomingPaymentsFromPodcast(podId ?? '', user.myid) // how to handle nullish
  const [spentInMessagesBoost] = useMemo(
    () =>
      transformPayments({ payments, userId: user.myid, chats }).filter(
        (c) => c.chat_id === chat.id
      ),
    [payments, user.myid, chats] // formerly payments.length
  )

  // Fixes the issue of showing NaN when spentInMessagesBoost returns null
  const showSpent =
    !!spentInMessagesBoost && spentInMessagesBoost?.amount
      ? spent + spentInMessagesBoost?.amount
      : spent

  return (
    <Appbar.Header
      style={{
        ...styles.wrap,
        backgroundColor: theme.bg,
        borderBottomColor: theme.border,
      }}
    >
      <View style={styles.row}>
        <TouchableOpacity onPress={onBackPress} style={{ marginLeft: 6, marginRight: 6 }}>
          <FeatherIcon name='chevron-left' size={28} color={theme.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onChatTitlePress} style={{ ...styles.row }} activeOpacity={0.6}>
          <View style={{ marginRight: 10 }}>
            <Avatar alias={name} photo={uri || ''} size={38} big aliasSize={15} />
          </View>
          <View>
            <View
              style={{
                ...styles.row,
              }}
            >
              <Typography
                size={16}
                numberOfLines={1}
                // style={{ width: name?.length > 20 ? SCREEN_WIDTH - 180 : 'auto' }}
              >
                {name}
              </Typography>

              {status !== null && (
                <MaterialIcon
                  name='lock'
                  style={{ marginLeft: 6 }}
                  size={13}
                  color={status === 'active' ? theme.active : theme.inactive}
                />
              )}
            </View>
            <Typography size={12} color={theme.subtitle}>
              {isTribeAdmin ? `Earned: ${earned} sats` : `Contributed: ${showSpent} sats`}
            </Typography>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={{ marginRight: 6 }} onPress={onChatInfoPress}>
        <FeatherIcon name='info' size={24} color={theme.icon} />
      </TouchableOpacity>
    </Appbar.Header>
  )
}

export default observer(Header)

const styles = StyleSheet.create({
  wrap: {
    height: 64,
    width: '100%',
    elevation: 0,
    borderBottomWidth: 1,
    zIndex: 102,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center'
  },
})
