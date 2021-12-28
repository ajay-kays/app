import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import Modal from '../ModalWrap'
import FastImage from 'react-native-fast-image'
import { IconButton } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Swiper from 'react-native-swiper'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import Toast from 'react-native-simple-toast'
import ReadMore from 'react-native-read-more-text'

import { useStores, useTheme } from 'store'
import { SCREEN_WIDTH, STATUS_BAR_HEIGHT } from 'lib/constants'
import { parseLDAT } from 'lib/ldat'
import { useCachedEncryptedFile } from 'views/chat/msg/hooks'
import Button from 'views/common/Button'
import Boost from 'views/common/Button/Boost'
import Typography from 'views/common/Typography'
import BoostDetails from './BoostDetails'

export default function PhotoViewer({ visible, close, photos, chat, initialIndex }) {
  const theme = useTheme()
  return (
    <Modal
      noSwipe
      visible={visible}
      animationType='slide'
      presentationStyle='fullScreen'
      onDismiss={close}
      noHeader
    >
      <View style={{ ...styles.wrap, backgroundColor: theme.black }}>
        {/* @ts-ignore  */}
        <IconButton
          icon={() => <MaterialCommunityIcon name='close' color={theme.white} size={30} />}
          onPress={close}
          style={{ ...styles.closeButton }}
        />
        <Swiper
          horizontal={false}
          showsButtons={false}
          showsPagination={false}
          index={initialIndex}
          loop={false}
        >
          {photos.map((p, index) => (
            <SwipeItem key={index} {...p} chat={chat} />
          ))}
        </Swiper>
      </View>
    </Modal>
  )
}

function SwipeItem(props) {
  const [photoH, setPhotoH] = useState(0)
  const { uuid, message_content, media_type, media_token, chat, boosts_total_sats } = props

  const [onlyOneClick, setOnlyOnClick] = useState(false)
  const [buying, setBuying] = useState(false)
  const [pricePerMessage, setPricePerMessage] = useState(0)
  const { chats, msg, user, details } = useStores()
  const theme = useTheme()

  const ldat = parseLDAT(media_token)
  console.log('LDAT:', ldat)
  let { data, uri, loading, trigger, paidMessageText } = useCachedEncryptedFile(props, ldat)

  useEffect(() => {
    fetchTribeDetails()
  }, [])

  async function fetchTribeDetails() {
    const tribe = await chats.getTribeDetails(chat.host, chat.uuid)
    if (tribe) {
      const price = tribe.price_per_message + tribe.escrow_amount
      setPricePerMessage(price)
    }
  }

  useEffect(() => {
    trigger()
  }, [media_token])

  let amt = null
  let purchased = false
  if (ldat && ldat.meta && ldat.meta.amt) {
    amt = ldat.meta.amt
    if (ldat.sig) purchased = true
  }

  const isMe = props.sender === user.myid
  const hasImgData = data || uri ? true : false
  const hasContent = message_content ? true : false
  const showPurchaseButton = amt && !isMe ? true : false
  const showStats = isMe && amt
  const sold = props.sold

  let isImg = false
  let showPayToUnlockMessage = false
  if (media_type === 'n2n2/text') {
    if (!isMe && !loading && !paidMessageText) showPayToUnlockMessage = true
  }
  if (media_type.startsWith('image') || media_type.startsWith('video')) {
    isImg = true
  }

  async function buy(amount) {
    setOnlyOnClick(true)
    setBuying(true)
    let contact_id = props.sender
    if (!contact_id) {
      contact_id = chat.contact_ids && chat.contact_ids.find((cid) => cid !== user.myid)
    }

    await msg.purchaseMedia({
      chat_id: chat.id,
      media_token,
      amount,
      contact_id,
    })

    setBuying(false)
  }

  function onPurchasePress() {
    if (!purchased && !buying && !onlyOneClick) buy(amt)
  }

  async function onBoostPress() {
    if (!uuid) return
    const amount = (user.tipAmount || 100) + pricePerMessage

    if (amount > details.balance) {
      Toast.showWithGravity('Not Enough Balance', Toast.SHORT, Toast.TOP)
      return
    }

    msg.sendMessage({
      boost: true,
      contact_id: null,
      text: '',
      amount,
      chat_id: chat.id || null,
      reply_uuid: uuid,
      message_price: pricePerMessage,
    })

    Toast.showWithGravity('Boosted!', Toast.LONG, Toast.CENTER)
  }

  const w = SCREEN_WIDTH
  const showBoostRow = boosts_total_sats ? true : false

  return (
    <View style={{ ...styles.swipeItem }}>
      {isImg && showPurchaseButton && !purchased && (
        <View style={{ ...styles.locked }}>
          <>
            <Ionicon name='lock-closed' color={theme.silver} size={50} />
            {showPurchaseButton && (
              <Button w='50%' onPress={onPurchasePress} loading={buying} style={{ marginTop: 14 }}>
                {purchased ? 'Purchased' : `Pay ${amt} sat`}
              </Button>
            )}
          </>
        </View>
      )}
      {hasImgData && (
        <View>
          {showStats && (
            <View style={{ ...styles.stats }}>
              <Typography
                size={12}
                color={theme.white}
                bg={theme.accent}
                fw='500'
                style={{ ...styles.satStats }}
              >{`${amt} sat`}</Typography>
              <Typography
                size={12}
                color={theme.white}
                bg={theme.secondary}
                fw='500'
                style={{ ...styles.satStats, opacity: sold ? 1 : 0 }}
              >
                Purchased
              </Typography>
            </View>
          )}
          <FastImage
            resizeMode='cover'
            source={{ uri: data || uri }}
            onLoad={(evt) => {
              setPhotoH((evt.nativeEvent.height / evt.nativeEvent.width) * w)
            }}
            style={{
              ...styles.photo,
              width: w,
              height: photoH,
            }}
          />
        </View>
      )}

      <View style={{ ...styles.footer }}>
        {hasContent && (
          <View style={{ ...styles.msgContent, backgroundColor: theme.transparent }}>
            <ScrollView style={{ ...styles.msgScroll }}>
              <ReadMore numberOfLines={3}>
                <Typography color={theme.white}>{message_content}</Typography>
              </ReadMore>
            </ScrollView>
          </View>
        )}

        <View style={{ ...styles.row, ...styles.boostRow }}>
          {!isMe ? <Boost onPress={onBoostPress} /> : <View></View>}
          <View>
            {showBoostRow && <BoostDetails {...props} myAlias={user.alias} myid={user.myid} />}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  swipeItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    position: 'relative',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: isIphoneX() ? getBottomSpace() : 15,
    width: '100%',
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + (isIphoneX() ? 16 : 2),
    right: 0,
    zIndex: 1,
  },
  photo: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
  locked: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  satStats: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    position: 'relative',
    zIndex: 9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    overflow: 'hidden',
  },
  msgContent: {
    paddingTop: 20,
    flex: 1,
    width: '100%',
  },
  msgScroll: {
    flex: 1,
    display: 'flex',
    overflow: 'scroll',
    maxHeight: 250,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  boostRow: {
    paddingTop: 10,
    paddingRight: 16,
    paddingLeft: 16,
  },
})
