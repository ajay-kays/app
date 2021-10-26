import React, { useState, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react-lite'
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions'
import { ActivityIndicator, IconButton } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video'
import FastImage from 'react-native-fast-image'
import RNFetchBlob from 'rn-fetch-blob'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../../store'

import { useTribeMediaType } from '../../../store/hooks/tribes'
import shared from './sharedStyles'
import { useCachedEncryptedFile } from './hooks'
import AudioPlayer from './audioPlayer'
import { parseLDAT } from 'lib/ldat'
import FileMsg from './fileMsg'
import BoostRow from './boostRow'
import Typography from '../../common/Typography'
import Button from '../../common/Button'
import PhotoViewer from '../../common/Modals/Media/PhotoViewer'
import { setTint } from '../../common/StatusBar'
import EmbedVideo from './embedVideo'
import { getRumbleLink, getYoutubeLink } from './utils'
import { useMsgs } from 'store/hooks'

function MediaMsg(props) {
  const { id, message_content, media_type, chat, media_token } = props
  const [onlyOneClick, setOnlyOnClick] = useState(false)
  const [buying, setBuying] = useState(false)
  const [mediaModal, setMediaModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const { meme, msg } = useStores()
  const theme = useTheme()
  const isMe = props.sender === props.myid

  let ldat = parseLDAT(media_token)
  let amt = null
  let purchased = false
  if (ldat && ldat.meta && ldat.meta.amt) {
    amt = ldat.meta.amt
    if (ldat.sig) purchased = true
  }

  let { data, uri, loading, paidMessageText } = useCachedEncryptedFile(props, ldat, true)

  const rumbleLink = useMemo(
    () => paidMessageText && getRumbleLink(paidMessageText),
    [paidMessageText]
  )
  const youtubeLink = useMemo(
    () => paidMessageText && getYoutubeLink(paidMessageText),
    [paidMessageText]
  )
  const isEmbedVideo = youtubeLink || rumbleLink

  const hasImgData = data || uri ? true : false
  const hasContent = message_content ? true : false
  const showPurchaseButton = amt && !isMe ? true : false
  const showStats = isMe && amt
  const sold = props.sold
  const showBoostRow = props.boosts_total_sats ? true : false

  let isImg = false
  let minHeight = 60
  let showPayToUnlockMessage = false

  if (media_type === 'n2n2/text') {
    minHeight = isMe ? 72 : 42
    if (!isMe && !loading && !paidMessageText) showPayToUnlockMessage = true
  }
  if (media_type.startsWith('audio')) {
    minHeight = 50
  }
  if (media_type.startsWith('image') || media_type.startsWith('video')) {
    minHeight = 200
    isImg = true
  }

  const buy = async (amount) => {
    setOnlyOnClick(true)
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

  const onMediaPress = () => {
    if (media_type.startsWith('image')) {
      setSelectedMedia(id)
      setMediaModal(true)
      setTimeout(() => {
        setTint('dark')
      }, 300)

      // if (data) ui.setImgViewerParams({ data })
      // if (uri) ui.setImgViewerParams({ uri })
    } else if (media_type.startsWith('n2n2/text')) {
      // downloadText(uri)
    }
  }

  const onButtonPressHandler = () => {
    if (!purchased && !buying && !onlyOneClick) buy(amt)
  }

  const onLongPressHandler = () => props.onLongPress(props)

  const downloadText = async (uri) => {
    try {
      let dirs = RNFetchBlob.fs.dirs
      const filename = meme.filenameCache[props.id]

      uri = uri.replace('file://', '')

      const res = await check(PERMISSIONS.IOS.CAMERA)

      if (res === RESULTS.GRANTED) {
        await RNFetchBlob.fs.cp(uri, dirs.DownloadDir + '/' + filename)
        Toast.showWithGravity('File Downloaded', Toast.SHORT, Toast.CENTER)
      } else {
        Toast.showWithGravity('Permission Denied', Toast.SHORT, Toast.CENTER)
      }
    } catch (err) {
      // Toast.showWithGravity('Permission Denied', Toast.SHORT, Toast.CENTER)
      console.warn(err)
    }
  }

  const msgs = useMsgs(chat) || []
  const photos = useTribeMediaType(msgs, 6)

  return (
    <View collapsable={false}>
      <TouchableOpacity onLongPress={onLongPressHandler} onPress={onMediaPress} activeOpacity={0.8}>
        {!hasImgData && (
          <View
            style={{
              minHeight,
              ...styles.loading,
              ...(isEmbedVideo && { width: 640 }),
            }}
          >
            {loading && (
              <View style={{ minHeight, ...styles.loadingWrap }}>
                <ActivityIndicator animating={true} color='grey' />
              </View>
            )}
            {Boolean(paidMessageText) && (
              <View
                style={{
                  minHeight,
                  ...styles.paidAttachmentText,
                  width: 640,
                  backgroundColor: 'transparent',
                  ...(isEmbedVideo && { height: 170 }),
                }}
              >
                {!!rumbleLink ? (
                  <EmbedVideo type='rumble' link={rumbleLink} onLongPress={onLongPressHandler} />
                ) : null}
                {!!youtubeLink ? (
                  <EmbedVideo type='youtube' link={youtubeLink} onLongPress={onLongPressHandler} />
                ) : null}
                {!rumbleLink && !youtubeLink && (
                  <Text
                    style={{
                      color: theme.title,
                      paddingTop: media_type === 'n2n2/text' ? 10 : 0,
                    }}
                  >
                    {paidMessageText}
                  </Text>
                )}
              </View>
            )}
            {showPayToUnlockMessage && (
              <View style={{ ...styles.paidAttachmentText }}>
                <Typography color={theme.subtitle}>Pay to unlock message</Typography>
              </View>
            )}
          </View>
        )}

        {hasImgData && (
          <Media type={media_type} data={data} uri={uri} filename={meme.filenameCache[props.id]} />
        )}

        {isImg && showPurchaseButton && !purchased && (
          <View style={styles.imgIconWrap}>
            <Ionicon name='image' color={theme.icon} size={50} />
          </View>
        )}

        {hasContent && (
          <View style={styles.msgContentWrap}>
            <Typography size={14} color={theme.subtitle}>
              {message_content}
            </Typography>
          </View>
        )}

        {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} pad />}
      </TouchableOpacity>

      {showStats && (
        <View style={styles.stats}>
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

      {showPurchaseButton && (
        <>
          {purchased ? (
            <View style={{ ...styles.purchasedWrap, backgroundColor: theme.main }}>
              <MaterialCommunityIcon
                name='check'
                color={theme.dark ? theme.white : theme.icon}
                size={20}
                style={{ paddingRight: 8 }}
              />
              <Typography size={15} style={{ paddingRight: 10 }}>
                Purchased
              </Typography>
            </View>
          ) : (
            <Button
              color={theme.dark ? theme.primary : theme.main}
              round={0}
              onPress={onButtonPressHandler}
              loading={buying}
              icon={() => (
                <MaterialCommunityIcon
                  name='arrow-top-right'
                  color={theme.dark ? theme.white : theme.icon}
                  size={18}
                />
              )}
            >
              <Typography size={12}>{`Pay ${amt} sat`}</Typography>
            </Button>
          )}
        </>
      )}
      <PhotoViewer
        visible={mediaModal}
        close={() => {
          setMediaModal(false)

          setTint(theme.dark ? 'dark' : 'light')
        }}
        // photos={photos}
        photos={photos && photos.filter((m) => m.id === selectedMedia)}
        // initialIndex={photos && photos.findIndex(m => m.id === selectedMedia)}
        initialIndex={0}
        chat={chat}
      />
    </View>
  )
}

export default observer(MediaMsg)

function Viewer(props) {
  return useMemo(() => <PhotoViewer {...props} />, [props.visible])
}

function Media({ type, data, uri, filename }) {
  if (type === 'n2n2/text') {
    return <FileMsg type={type} uri={uri} filename={filename} />
  }
  if (type.startsWith('image')) {
    return <FastImage style={styles.photo} resizeMode='cover' source={{ uri: uri || data }} />
  }
  if (type.startsWith('audio')) {
    return <AudioPlayer source={uri || data} />
  }
  if (type.startsWith('video') && uri) {
    return <VideoPlayer uri={{ uri }} />
  }
  return null
}

// video player component
function VideoPlayer(props) {
  const { ui } = useStores()
  function onEnd() {}
  function onPlay() {
    ui.setVidViewerParams(props)
  }
  return (
    <>
      <Video
        source={props.uri}
        resizeMode='cover'
        paused={true}
        onEnd={onEnd}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 100,
        }}
      />
      <IconButton
        icon='play'
        size={55}
        color='white'
        style={{ position: 'absolute', top: 50, left: 50, zIndex: 101 }}
        onPress={onPlay}
      />
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    // flex: 1,
    width: 200,
    // minHeight: 200,
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 30,
  },
  photo: {
    width: 200,
    height: 200,
  },
  stats: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    // ...shared.innerPad,
    padding: 10,
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
  paidAttachmentText: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...shared.innerPad,
  },
  loading: {
    width: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  loadingWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imgIconWrap: {
    position: 'absolute',
    width: '100%',
    top: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchasedWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shared.innerPad,
  },
  msgContentWrap: {
    width: 200,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    ...shared.innerPad,
    // paddingTop: shared.innerPad.paddingTop,
    // paddingBottom: shared.innerPad.paddingBottom
  },
})
