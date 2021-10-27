import React, { useEffect, useState, useRef, useMemo } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react-lite'
import FastImage from 'react-native-fast-image'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator } from 'react-native-paper'
import { useStores, useTheme } from 'store'
import { parseLDAT } from 'lib/ldat'
import { useCachedEncryptedFile } from '../../../chat/msg/hooks'
import { SCREEN_WIDTH } from 'lib/constants'
import { isBase64 } from 'lib/crypto/Base64'
import { getRumbleLink, getYoutubeLink } from '../../../chat/msg/utils'
import EmbedVideo from '../../../chat/msg/embedVideo'

function MediaItem(props) {
  const { index, id, media_type, chat, media_token, onMediaPress } = props
  const ldat = parseLDAT(media_token)

  const [buying, setBuying] = useState(false)
  const { msg } = useStores()
  const theme = useTheme()
  let { data, uri, loading, trigger, paidMessageText } = useCachedEncryptedFile(props, ldat)

  let amt = null
  let purchased = false
  if (ldat && ldat.meta && ldat.meta.amt) {
    amt = ldat.meta.amt
    if (ldat.sig) purchased = true
  }

  const isMe = props.sender === props.myid
  const hasImgData = data || uri ? true : false
  const showPurchaseButton = amt && !isMe ? true : false
  let isImg = false
  let showPayToUnlockMessage = false
  if (media_type === 'n2n2/text') {
    if (!isMe && !loading && !paidMessageText) showPayToUnlockMessage = true
  }
  if (media_type.startsWith('image') || media_type.startsWith('video')) {
    isImg = true
  }

  const decodedMessageInCaseOfEmbedVideo = isBase64(paidMessageText).text
  const rumbleLink = useMemo(
    () => getRumbleLink(decodedMessageInCaseOfEmbedVideo),
    [decodedMessageInCaseOfEmbedVideo]
  )
  const youtubeLink = useMemo(
    () => getYoutubeLink(decodedMessageInCaseOfEmbedVideo),
    [decodedMessageInCaseOfEmbedVideo]
  )

  // Before implementation uses youtubeLink || rumbleLink;
  // but this is only available once the user pay for this content
  const isEmbedVideo = decodedMessageInCaseOfEmbedVideo

  useEffect(() => {
    trigger()
  }, [media_token])

  function handleMediaPress() {
    return onMediaPress(id)
  }

  async function buy(amount) {
    setBuying(true)
    let contact_id = props.sender
    if (!contact_id) {
      contact_id = chat.contact_ids && chat.contact_ids.find((cid) => cid !== props.myid)
    }

    await msg.purchaseMedia({
      chat_id: chat.id,
      media_token,
      amount,
      contact_id,
    })
    setBuying(false)
  }

  return (
    <>
      <TouchableOpacity
        onPress={Boolean(isEmbedVideo) ? () => null : handleMediaPress}
        delayLongPress={150}
        activeOpacity={0.8}
        style={{
          ...styles.photoWrap,
          marginRight: (index + 1) % 3 === 0 ? 0 : 5,
        }}
      >
        {hasImgData && <MediaType type={media_type} data={data} uri={uri} />}

        {showPurchaseButton && !purchased && (
          <View style={{ ...styles.locked, backgroundColor: theme.main }}>
            {buying ? (
              <ActivityIndicator size='small' />
            ) : (
              <>
                <Ionicon name='lock-closed' color={theme.silver} size={30} />
              </>
            )}
          </View>
        )}
        {Boolean(youtubeLink || rumbleLink) && (
          <View style={{ width: 20 }}>
            <EmbedVideo squareSize={SCREEN_WIDTH / 3 - 10 / 3} type='rumble' link={rumbleLink} />
            <EmbedVideo squareSize={SCREEN_WIDTH / 3 - 10 / 3} type='youtube' link={youtubeLink} />
          </View>
        )}
      </TouchableOpacity>
    </>
  )
}

function MediaType({ type, data, uri }) {
  if (type === 'n2n2/text') return <></>
  if (type.startsWith('image')) {
    return (
      <FastImage
        // resizeMode='cover'
        source={{ uri: uri || data }}
        style={{ ...styles.photo }}
      />
    )
  }
  return null
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWrap: {
    position: 'relative',
    width: SCREEN_WIDTH / 3 - 10 / 3,
    height: SCREEN_WIDTH / 3 - 10 / 3,
    marginBottom: 5,
  },
  photo: {
    width: '100%',
    height: '100%',
    // borderRadius: 5
  },
  locked: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default React.memo(MediaItem)
