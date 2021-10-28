import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores, useTheme } from 'store'
import { MsgList } from '../MsgList'
import { useNavigation, useRoute } from '@react-navigation/core'
import { display } from 'lib/logging'
import { ChatRouteProp, navigate } from 'nav'
import { reportError } from 'lib/errorHelper'
import { constants } from 'lib/constants'
import { contactForConversation } from './utils'
import EE, { LEFT_GROUP } from 'lib/ee'
import { StreamPayment } from 'store/feed'
import { ActivityIndicator, KeyboardAvoidingView, View } from 'react-native'

export type RouteStatus = 'active' | 'inactive' | null

const ChatroomFC = () => {
  const { contacts, user, chats, msg } = useStores()
  const theme = useTheme()
  const myid = user.myid
  const route = useRoute<ChatRouteProp>()

  const [pricePerMessage, setPricePerMessage] = useState(0)
  const [appMode, setAppMode] = useState(false)
  const [status, setStatus] = useState<RouteStatus>(null)
  const [tribeParams, setTribeParams] = useState<any>(null) // what else could we make this
  const [pod, setPod] = useState<any>(null) // ?
  const [podError, setPodError] = useState<string | null>(null)

  const feedURL = tribeParams && tribeParams.feed_url
  const tribeBots = tribeParams && tribeParams.bots
  console.log('route params:', route.params)
  const chatID = route.params.id
  const chat = useMemo(
    () => chats.chatsArray.find((c) => c.id === chatID) || route.params,
    [chatID, chats.chats, route.params]
  )

  const navigation = useNavigation()

  const [loadingChat, setLoadingChat] = useState(false)

  const loadPod = useCallback(
    async (tr) => {
      const params = await chats.loadFeed(chat.host, chat.uuid, tr.feed_url)

      if (params) setPod(params)
      if (!params) setPodError('no podcast found')
    },
    [chat.host, chat.uuid, chats]
  )

  const fetchTribeParams = useCallback(async () => {
    const isTribe = chat && chat.type === constants.chat_types.tribe
    const isTribeAdmin = isTribe && chat.owner_pubkey === user.publicKey
    // let isAppURL = false
    // let isFeedURL = false
    try {
      if (isTribe) {
        //&& !isTribeAdmin) {
        setAppMode(true)
        setLoadingChat(true)
        const params = await chats.getTribeDetails(chat.host, chat.uuid)
        if (params) {
          const price = params.price_per_message + params.escrow_amount
          setPricePerMessage(price)
          // Toast.showWithGravity('Price Per Message: ' + price + ' sat', 0.3, Toast.CENTER)

          if (!isTribeAdmin) {
            if (chat.name !== params.name || chat.photo_url !== params.img) {
              chats.updateTribeAsNonAdmin(chat.id, params.name, params.img)
            }
          }
          setTribeParams(params)
          if (params.feed_url) {
            loadPod(params)
          }
        }
        setLoadingChat(false)
      } else {
        setAppMode(false)
        setTribeParams(null)
      }
    } catch (e) {
      console.log(e)
      setLoadingChat(false)
      reportError(e)
    }

    const r = await chats.checkRoute(chat.id.toString(), myid)

    if (r && r.success_prob && r.success_prob > 0) {
      setStatus('active')
    } else {
      setStatus('inactive')
    }
  }, [chat, chats, loadPod, myid, user.publicKey])

  useEffect(() => {
    // check for contact key, exchange if none
    const contact = contactForConversation(chat, contacts.contactsArray, myid)

    if (contact && !contact.contact_key) {
      contacts.exchangeKeys(contact.id)
    }
    EE.on(LEFT_GROUP, () => {
      navigate('Tribes', { params: { rnd: Math.random() } })
    })

    fetchTribeParams()

    return () => {
      setTribeParams(null)
    }
  }, [chat, contacts, fetchTribeParams, myid, navigation])

  function onBoost(sp: StreamPayment) {
    if (!(chat && chat.id)) return
    msg.sendMessage({
      contact_id: null,
      text: `boost::${JSON.stringify(sp)}`,
      chat_id: chat.id || null,
      amount: pricePerMessage,
      reply_uuid: '',
    })
  }

  let pricePerMinute = 0
  if (pod && pod.value && pod.value.model && pod.value.model.suggested) {
    pricePerMinute = Math.round(parseFloat(pod.value.model.suggested) * 100000000)
  }

  const showPod = feedURL ? true : false

  const msgs = msg.messages.get(chatID.toString())

  display({
    name: 'ChatroomFC',
    important: true,
    value: { chat, msgs, pricePerMessage, chatID, route },
  })

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={{ flex: 1, backgroundColor: theme.bg }}
      keyboardVerticalOffset={1}
    >
      {/* <Header
        chat={chat}
        appMode={appMode}
        setAppMode={setAppMode}
        status={status}
        tribeParams={tribeParams}
        pricePerMinute={pricePerMinute}
        podId={pod?.id}
      /> */}
      {loadingChat ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.bg,
          }}
        >
          <ActivityIndicator animating={true} />
        </View>
      ) : (
        <MsgList chat={chat} msgs={msgs} pricePerMessage={pricePerMessage} />
      )}
    </KeyboardAvoidingView>
  )
}

export const Chatroom = observer(ChatroomFC)
