import React, { useState, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import { ActivityIndicator, IconButton } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FastImage from 'react-native-fast-image'
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import * as base64 from 'base-64'
import { useStores, useTheme } from 'store'
import { SCREEN_HEIGHT, SCREEN_WIDTH, STATUS_BAR_HEIGHT } from 'lib/constants'
import { randString } from 'lib/crypto/rand'
import * as e2e from 'lib/crypto/e2e'
import ModalWrap from '../ModalWrap'
import SetPrice from './SetPrice'
import Typography from '../../Typography'
import { setTint } from '../../StatusBar'

function PostPhotoWrap() {
  const { ui } = useStores()
  const theme = useTheme()

  const visible =
    ui.imgViewerParams &&
    (ui.imgViewerParams.data || ui.imgViewerParams.uri || ui.imgViewerParams.msg)
      ? true
      : false

  const params = ui.imgViewerParams

  function close() {
    ui.setImgViewerParams(null)
    setTint(theme.dark ? 'dark' : 'light')
  }

  return (
    <ModalWrap onClose={close} visible={visible} noHeader noSwipe>
      {visible && <PostPhoto params={params} close={close} />}
    </ModalWrap>
  )
}

export default observer(PostPhotoWrap)

function PostPhotoFC(props) {
  const { params, close } = props
  const { data, uri, chat_id, contact_id, pricePerMessage } = params

  const { meme, msg } = useStores()
  const theme = useTheme()
  const [text, setText] = useState('')
  const [price, setPrice] = useState(0)
  const [inputFocused, setInputFocused] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadPercent, setUploadedPercent] = useState(0)
  const inputRef = useRef<any>(null)

  const showImg = uri || data ? true : false
  const showInput = contact_id || chat_id ? true : false
  const showMsgMessage = params.msg ? true : false
  //   const title = showMsgMessage ? 'Send Paid Message' : 'Send Image'

  async function sendFinalMsg({ muid, media_key, media_type, price }) {
    await msg.sendAttachment({
      contact_id,
      chat_id,
      muid,
      price,
      media_key,
      media_type,
      text: showMsgMessage ? '' : text,
      amount: pricePerMessage || 0,
    })
    close()
  }

  async function sendGif() {
    const gifJSON = JSON.stringify({
      id: params.id,
      url: params.uri,
      aspect_ratio: params.aspect_ratio,
      text: showMsgMessage ? '' : text,
    })
    const b64 = base64.encode(gifJSON)
    await msg.sendMessage({
      contact_id,
      chat_id,
      text: 'giphy::' + b64,
      reply_uuid: '',
      amount: 0,
    })
    close()
  }

  async function sendAttachment() {
    if (uploading) return

    const isGif = uri && uri.split(/[#?]/)[0].split('.').pop().trim() === 'gif'
    if (isGif) {
      sendGif()
      return
    }

    setUploading(true)
    inputRef?.current?.blur()
    const type = showMsgMessage ? 'n2n2/text' : 'image/jpg'
    const name = showMsgMessage ? 'Message.txt' : 'Image.jpg'

    const pwd = await randString(32)
    const server = meme.getDefaultServer()
    if (!server) return
    if (!(uri || (showMsgMessage && text))) return

    let enc = null
    if (showMsgMessage) {
      enc = await e2e.encrypt(text, pwd)
    } else {
      const newUri = uri.replace('file://', '')
      enc = await e2e.encryptFile(newUri, pwd)
    }

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
          type: type,
          data: enc,
        },
        { name: 'name', data: name },
      ]
    )
      // listen to upload progress event, emit every 250ms
      .uploadProgress({ interval: 250 }, (written, total) => {
        console.log('uploaded', written / total)
        setUploadedPercent(Math.round((written / total) * 100))
      })
      .then(async (resp) => {
        let json = resp.json()
        await sendFinalMsg({
          muid: json.muid,
          media_key: pwd,
          media_type: type,
          price,
        })
        setUploading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const boxStyles = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }
  const disabled = uploading || (showMsgMessage && !price)

  function onShowAmount() {
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.black }}>
      {/* @ts-ignore  */}
      <IconButton
        icon={() => <MaterialCommunityIcon name='close' color={theme.icon} size={30} />}
        onPress={close}
        style={{ ...styles.closeButton }}
      />
      {showInput && <SetPrice setAmount={(amt) => setPrice(amt)} onShow={onShowAmount} />}
      {showImg && (
        <FastImage
          resizeMode='contain'
          source={{ uri: uri || data }}
          style={{ ...styles.img, ...boxStyles }}
        />
      )}
      {showMsgMessage && !uploading && (
        <View style={{ ...styles.msgMessage, ...boxStyles }}>
          <Typography color={theme.white}>Set a price and enter your message</Typography>
        </View>
      )}

      {uploading && (
        <View
          style={{
            ...styles.activityWrap,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT - 180,
          }}
        >
          <ActivityIndicator animating={true} color='white' size='large' />
          <Typography
            color={theme.white}
            size={16}
            style={{
              marginTop: 16,
            }}
          >{`${uploadPercent}%`}</Typography>
        </View>
      )}

      {showInput && (
        <KeyboardAvoidingView
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}
          behavior='position'
          keyboardVerticalOffset={1}
        >
          <View
            style={{
              ...styles.inputWrap,
              bottom: isIphoneX() ? getBottomSpace() : 15,
            }}
          >
            <TextInput
              placeholder='Message...'
              ref={inputRef}
              style={{
                ...styles.input,
                backgroundColor: theme.inputBg,
                color: theme.input,
              }}
              placeholderTextColor={theme.subtitle}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onChangeText={(e) => setText(e)}
              value={text}
            />
            <TouchableOpacity
              activeOpacity={0.6}
              style={{ ...styles.sendButton, backgroundColor: theme.primary }}
              onPress={() => sendAttachment()}
              disabled={disabled}
            >
              <MaterialCommunityIcon name='send' size={17} color={theme.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  )
}

const PostPhoto = observer(PostPhotoFC)

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  img: {
    width: '100%',
  },
  activityWrap: {
    height: '80%',
    width: '100%',
    position: 'absolute',
    top: '10%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrap: {
    position: 'absolute',
    width: '100%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 14,
    paddingRight: 14,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingLeft: 18,
    paddingRight: 18,
    height: 40,
    fontSize: 17,
    lineHeight: 20,
  },
  sendButton: {
    marginLeft: 7,
    width: 42,
    maxWidth: 42,
    height: 42,
    maxHeight: 42,
    borderRadius: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 1,
    right: 0,
    zIndex: 1,
  },
})
