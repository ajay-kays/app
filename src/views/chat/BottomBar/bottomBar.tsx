import React, { useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import {
  Keyboard,
  View,
  TextInput,
  TouchableOpacity,
  PanResponder,
  Animated,
  Platform,
} from 'react-native'
import { IconButton, ActivityIndicator } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import Toast from 'react-native-simple-toast'
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import { Modalize } from 'react-native-modalize'
import { useMsgs, useStores, useTheme } from 'store'
import { calcBotPrice, useReplyContent } from 'store/hooks/chat'
import { randString } from 'lib/crypto/rand'
import * as e2e from 'lib/crypto/e2e'
import EE, { EXTRA_TEXT_CONTENT, REPLY_UUID, CANCEL_REPLY_UUID, CLEAR_REPLY_UUID } from 'lib/ee'
import { constants } from 'lib/constants'
import { fetchGifs } from '../giphy/fetchGifs'
import ReplyContent from '../msg/replyContent'
import RNFetchBlob from 'rn-fetch-blob'
import Giphy from '../giphy'
import EmbedVideo from '../embedVideo'
import { requestAudioPermissions, uploadAudioFile } from '../audioHelpers'
import Camera from '../../common/Accessories/Camera'
import { setTint } from '../../common/StatusBar'
import ChatOptions from '../../common/Dialogs/ChatOptions'
import { styles } from './styles'
import { RecordingBottomBar } from './RecordingBottomBar'
import { reportError } from 'lib/errorHelper'

let dirs = RNFetchBlob.fs.dirs

const conversation = constants.chat_types.conversation

const audioRecorderPlayer = new AudioRecorderPlayer()

let nonStateRecordingStartTime = 0
let dontRecordActually = false

function BottomBar({ chat, pricePerMessage, tribeBots }) {
  const { user, ui, msg, meme } = useStores()
  const theme = useTheme()
  const [text, setText] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const [takingPhoto, setTakingPhoto] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [recordSecs, setRecordSecs] = useState<any>('0:00')
  const [recordingStartTime, setRecordingStartTime] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [gifs, setGifs] = useState<any>([])
  const [searchGif, setSearchGif] = useState<any>('Bitcoin')
  const [showGiphyModal, setShowGiphyModal] = useState(false)
  const embedVideoModalRef = useRef<Modalize>(null)
  const [replyUuid, setReplyUuid] = useState('')
  const [extraTextContent, setExtraTextContent] = useState(null)
  const myid = user.myid
  const modalizeRef = useRef<Modalize>(null)
  const [isSearchCompleted, setIsSearchCompleted] = useState(true)

  const inputRef = useRef(null)

  const hasLoopout =
    tribeBots &&
      tribeBots.length &&
      tribeBots.find(
        (tb) => tb.prefix === '/loopout' && tb.commands && tb.commands.find((c) => c.command === '*')
      )
      ? true
      : false

  const waitingForAdminApproval = chat.status === constants.chat_statuses.pending

  const openGiphyModal = () => modalizeRef.current?.open()

  async function sendMessage() {
    try {
      if (!text) return
      if (waitingForAdminApproval) return
      let contact_id = chat.contact_ids.find((cid) => cid !== myid)

      let { price, failureMessage } = calcBotPrice(tribeBots, text)
      if (failureMessage) {
        Toast.showWithGravity(failureMessage, Toast.SHORT, Toast.TOP)
        return
      }

      let txt = text
      if (extraTextContent) {
        const { type, ...rest } = extraTextContent as any // ?
        txt = type + '::' + JSON.stringify({ ...rest, text })
      }

      setText('')
      await msg.sendMessage({
        contact_id: contact_id || null,
        text: txt,
        chat_id: chat.id || null,
        amount: price + pricePerMessage || 0,
        reply_uuid: replyUuid || '',
      })
      if (replyUuid) {
        setReplyUuid('')
        EE.emit(CLEAR_REPLY_UUID, null)
      }
      if (extraTextContent) {
        setExtraTextContent(null)
      }
      // inputRef.current.blur()
      // setInputFocused(false)
    } catch (error) {
      console.log(error)
    }
  }

  function closeReplyContent() {
    if (replyUuid) {
      setReplyUuid('')
      EE.emit(CLEAR_REPLY_UUID, null)
    }
    if (extraTextContent) {
      setExtraTextContent(null)
    }
  }

  function gotExtraTextContent(body) {
    setExtraTextContent(body)
  }
  function gotReplyUUID(uuid) {
    setReplyUuid(uuid)
  }
  function cancelReplyUUID() {
    setReplyUuid('')
  }

  useEffect(() => {
    EE.on(EXTRA_TEXT_CONTENT, gotExtraTextContent)
    EE.on(REPLY_UUID, gotReplyUUID)
    EE.on(CANCEL_REPLY_UUID, cancelReplyUUID)
    return () => {
      EE.removeListener(EXTRA_TEXT_CONTENT, gotExtraTextContent)
      EE.removeListener(REPLY_UUID, gotReplyUUID)
      EE.removeListener(CANCEL_REPLY_UUID, cancelReplyUUID)
    }
  }, [])

  async function tookPic(img) {
    setDialogOpen(false)
    setTakingPhoto(false)

    setTimeout(() => {
      if (img && img.uri) {
        openImgViewer({ uri: img.uri })
        setTint('dark')
      }
    }, 500)
  }

  function openImgViewer(obj) {
    let contact_id = null

    if (!chat.id) {
      // if no chat (new contact)
      contact_id = chat.contact_ids.find((cid) => cid !== myid)
    }
    ui.setImgViewerParams({
      contact_id,
      chat_id: chat.id || null,
      ...obj,
      pricePerMessage,
    })
  }

  async function doPaidMessage() {
    setDialogOpen(false)
    openImgViewer({ msg: true })
  }

  async function startRecord() {
    if (dontRecordActually) {
      dontRecordActually = false
      setRecordingStartTime(null)
      return
    }
    setRecordSecs('0:00')
    try {
      const path = Platform.select({
        ios: 'sound.mp4',
        android: `${dirs.CacheDir}/sound.mp4`,
      })
      await audioRecorderPlayer.startRecorder(path)
      audioRecorderPlayer.addRecordBackListener((e) => {
        const str = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)) // changed from current_position which doesnt exist
        const idx = str.lastIndexOf(':')
        setRecordSecs(str.substr(1, idx - 1))
      })
      if (!dontRecordActually) {
        setRecordingStartTime(Date.now().valueOf())
      }
    } catch (e) {
      console.log(e || 'ERROR')
      reportError(e)
    }
  }

  async function stopRecord(cb, time?) {
    const now = Date.now().valueOf()
    let tooShort = false
    if (time && now - time < 1000) {
      tooShort = true
      await sleep(1000)
    }
    try {
      const result = await audioRecorderPlayer.stopRecorder()
      audioRecorderPlayer.removeRecordBackListener()
      setRecordSecs('0:00')
      if (cb && !tooShort) cb(result)
    } catch (e) {
      reportError(e)
    }
  }

  async function doneUploadingAudio(muid, pwd, type) {
    await sendFinalMsg({
      muid: muid,
      media_key: pwd,
      media_type: type,
    })
    setUploading(false)
  }

  // const position = useRef(new Animated.ValueXY()).current;
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderStart: () => {
          nonStateRecordingStartTime = Date.now().valueOf()
          requestAudioPermissions().then(startRecord)
        },
        onPanResponderEnd: async () => {
          const now = Date.now().valueOf()
          if (now - nonStateRecordingStartTime < 1000) {
            dontRecordActually = true
            stopRecord(null)
            setRecordingStartTime(null)
            setTimeout(() => {
              dontRecordActually = false
            }, 2000)
            return
          }
          await sleep(10)
          function callback(path) {
            setUploading(true)
            uploadAudioFile(path, meme.getDefaultServer(), doneUploadingAudio)
          }
          setRecordingStartTime((current) => {
            if (current) stopRecord(callback, current)
            return null
          })
        },
        onPanResponderMove: (evt, gestureState) => {
          if (gestureState.dx < -70) {
            setRecordingStartTime((current) => {
              if (current) {
                stopRecord(null) //cancel
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                })
              }
              return null
            })
          }
        },
        onPanResponderRelease: (evt, gestureState) => { },
      }),
    []
  )

  async function sendFinalMsg({ muid, media_key, media_type }) {
    await msg.sendAttachment({
      contact_id: null,
      chat_id: chat.id,
      muid,
      price: 0,
      media_key,
      media_type,
      text: '',
      amount: 0,
    })
  }

  function closeGiphyModal() {
    modalizeRef?.current?.close()
    setShowGiphyModal(false)
  }

  async function onGiphyHandler() {
    try {
      setDialogOpen(false)
      setShowGiphyModal(true)
      openGiphyModal()
      const gifs = await fetchGifs(searchGif)
      if (gifs.meta.status === 200) setGifs(gifs.data)
    } catch (e) {
      console.warn(e)
      reportError(e)
    }
  }

  async function getGifsBySearch() {
    setIsSearchCompleted(false)
    const gifs = await fetchGifs(searchGif)
    if (gifs.meta.status === 200) {
      setGifs(gifs.data)
      setIsSearchCompleted(true)
    } else setIsSearchCompleted(false)
  }

  async function onSendGifHandler(gif: any) {
    closeGiphyModal()
    setDialogOpen(false)
    setTimeout(() => {
      setTakingPhoto(false)
      const height = parseInt(gif.images.original.height) || 200
      const width = parseInt(gif.images.original.width) || 200
      openImgViewer({
        uri: gif.images.original.url,
        aspect_ratio: width / height,
        id: gif.id,
      })
    }, 150)
  }

  // =========== Embed Video Logic ============
  const openEmbedVideoModal = () => embedVideoModalRef.current?.open()
  const onEmbedVideoHandler = () => {
    setDialogOpen(false)
    openEmbedVideoModal()
  }
  const closeEmbedVideoModal = () => {
    embedVideoModalRef?.current?.close()
  }
  async function onSendEmbedVideoHandler({ message_price, video }) {
    try {
      closeEmbedVideoModal()
      setDialogOpen(false)
      const embedVideoLink = video as string
      if (!embedVideoLink) return

      const type = 'n2n2/text'
      const name = 'Message.txt'
      const pwd = await randString(32)
      const server = meme.getDefaultServer()
      if (!server) return

      const enc = await e2e.encrypt(embedVideoLink, pwd)
      const contactID = chat.contact_ids.find((cid) => cid !== myid)

      RNFetchBlob.fetch(
        'POST',
        `https://${server.host}/file`,
        {
          Authorization: `Bearer ${server.token}`,
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'file',
            filename: name,
            type,
            data: enc,
          },
          { name: 'name', data: name },
        ]
      )
        // listen to upload progress event, emit every 250ms
        .uploadProgress({ interval: 250 }, (written, total) => {
          console.log('uploaded', written / total)
        })
        .then(async (resp) => {
          let json = resp.json()
          await msg.sendAttachment({
            contact_id: contactID || null,
            chat_id: chat.id || null,
            muid: json.muid,
            price: message_price,
            media_key: pwd,
            media_type: type,
            text: '',
            amount: pricePerMessage || 0,
          })
          setUploading(false)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.log(error)
    }
  }
  // =========== Embed Video Logic ============

  const isConversation = chat.type === conversation
  // const isTribe = chat.type === constants.chat_types.tribe
  const hideMic = inputFocused || Boolean(text)

  // let theID = chat && chat.id
  // const thisChatMsgs = theID && msg.messages[theID]

  const msgs = useMsgs(chat) || []

  const { replyMessageSenderAlias, replyMessageContent, replyMessageExtraContent, replyColor } =
    useReplyContent(msgs, replyUuid, extraTextContent)

  const hasReplyContent = replyUuid || extraTextContent ? true : false

  return (
    <View
      style={{
        ...styles.bar,
        backgroundColor: theme.bg,
      }}
      accessibilityLabel='chat-bottombar'
    >
      {/* Reply area */}
      {/* Only renders if `hasReplyContent` is a truthy value*/}
      <ReplyContent
        shouldRender={hasReplyContent}
        reply={true}
        replyMessageExtraContent={replyMessageExtraContent}
        showClose={true}
        color={replyColor}
        content={replyMessageContent}
        senderAlias={replyMessageSenderAlias}
        onClose={closeReplyContent}
      />

      {/* Bottom row */}
      <View
        style={{
          ...styles.barInner,
          borderColor: theme.border,
          backgroundColor: theme.bg,
          paddingTop: isIphoneX() ? (inputFocused ? 10 : 5) : 5,
          paddingBottom: inputFocused ? 5 : isIphoneX() ? getBottomSpace() : 5,
        }}
        accessibilityLabel='chat-bottombar-inner'
      >
        {!recordingStartTime && (
          <>
            <PlusButton setDialogOpen={setDialogOpen} />
            <TextInput
              textAlignVertical='top'
              accessibilityLabel='message-input'
              blurOnSubmit={true}
              placeholder='Message...'
              ref={inputRef}
              style={{
                ...styles.input,
                height: 45,
                backgroundColor: theme.inputBg,
                borderColor: theme.border,
                color: theme.input,
              }}
              placeholderTextColor={theme.subtitle}
              onFocus={(e) => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onChangeText={(e) => setText(e)}
              value={text}
            />
          </>
        )}
        {/* Only renders if `recordingStartTime` is a truthy value*/}
        <RecordingBottomBar recordingStartTime={recordingStartTime} recordSecs={recordSecs} />

        {!hideMic && (
          <MicButton
            panResponder={panResponder}
            uploading={uploading}
            recordingStartTime={recordingStartTime}
          />
        )}
        {hideMic && <SendButton text={text} sendMessage={sendMessage} />}

        <ChatOptions
          visible={dialogOpen}
          onCancel={() => setDialogOpen(false)}
          hasLoopout={hasLoopout}
          isConversation={isConversation}
          onPick={(res) => tookPic(res)}
          onChooseCam={() => setTakingPhoto(true)}
          doPaidMessage={() => doPaidMessage()}
          request={() => {
            // setDialogOpen(false)
            ui.setPayMode('invoice', chat)
          }}
          send={() => {
            // setDialogOpen(false)
            ui.setPayMode('payment', chat)
          }}
          loopout={() => {
            // setDialogOpen(false)
            ui.setPayMode('loopout', chat)
          }}
          onGiphyHandler={onGiphyHandler}
          onEmbedVideoHandler={onEmbedVideoHandler}
        />

        <Giphy
          ref={modalizeRef}
          open={showGiphyModal}
          onClose={closeGiphyModal}
          gifs={gifs}
          searchGif={searchGif}
          setSearchGif={setSearchGif}
          onSendGifHandler={onSendGifHandler}
          getGifsBySearch={getGifsBySearch}
          isSearchCompleted={isSearchCompleted}
        />


        <EmbedVideo ref={embedVideoModalRef} onSendEmbedVideo={onSendEmbedVideoHandler} />
      </View>

      <Camera
        visible={takingPhoto}
        onSnap={tookPic}
        onCancel={() => {
          setTakingPhoto(false)
          setDialogOpen(false)
          setTint(theme.dark ? 'dark' : 'light')
        }}
      />
    </View>
  )
}

export default observer(BottomBar)

type IMicButton = {
  panResponder: any
  uploading: boolean
  recordingStartTime: any
}
function MicButton({ panResponder, uploading, recordingStartTime }: IMicButton) {
  return (
    <Animated.View
      style={{ marginLeft: 0, marginRight: 4, zIndex: 9 }}
      {...panResponder.panHandlers}
    >
      {uploading ? (
        <View style={{ width: 42 }}>
          <ActivityIndicator size={20} color='grey' />
        </View>
      ) : (
        <IconButton
          icon='microphone-outline'
          size={28}
          color={recordingStartTime ? 'white' : '#666'}
        />
      )}
    </Animated.View>
  )
}

type ISendButton = { text: string; sendMessage: () => Promise<void> }
function SendButton({ text, sendMessage }: ISendButton) {
  const theme = useTheme()
  return (
    <View style={styles.sendButtonWrap}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          ...styles.sendButton,
          backgroundColor: text ? theme.primary : theme.grey,
        }}
        onPress={() => sendMessage()}
        accessibilityLabel='send-message'
        disabled={!text}
      >
        <Icon name='send' size={17} color='white' />
      </TouchableOpacity>
    </View>
  )
}

function PlusButton({ setDialogOpen }) {
  const theme = useTheme()
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={{
        ...styles.attach,
        backgroundColor: theme.bg,
      }}
      accessibilityLabel='more-button'
      onPress={() => {
        Keyboard.dismiss()
        setDialogOpen(true)
      }}
    >
      <Icon name='plus' color={theme.primary} size={27} />
    </TouchableOpacity>
  )
}
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
