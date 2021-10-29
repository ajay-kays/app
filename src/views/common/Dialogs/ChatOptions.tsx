import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { IconButton } from 'react-native-paper'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'react-native-image-picker'
import { useTheme } from 'store'
import MenuSheet from '../ActionSheet/MenuSheet'

export default function ChatOptions({
  visible,
  onCancel,
  onPick,
  onChooseCam,
  doPaidMessage,
  request,
  send,
  loopout,
  isConversation,
  onGiphyHandler,
  onEmbedVideoHandler,
  hasLoopout,
}) {
  const theme = useTheme()

  async function pickImage() {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (result) => {
        if (!result.didCancel) {
          onPick(result)
          return
        } else {
          onCancel()
        }
      }
    )
  }

  const pickImageHandler = () => pickImage()
  const pickGif = () => onGiphyHandler()
  const requestHandler = () => request()
  const sendHandler = () => send()
  const doPaidMessageHandler = () => doPaidMessage()
  const loopoutHandler = () => loopout()

  function close() {
    onCancel()
  }

  const commonItems = [
    {
      title: 'Camera',
      thumbIcon: (
        <IconButton
          icon={({ size, color }) => <AntDesignIcon name='camera' color={color} size={size} />}
          color={theme.white}
          size={18}
        />
      ),
      thumbBgColor: theme.primary,
      action: () => {
        close()
        setTimeout(() => {
          onChooseCam()
        }, 400)
      },
    },
    {
      title: 'Photo Library',
      thumbIcon: (
        <IconButton
          icon={({ size, color }) => <FontAwesomeIcon name='photo' color={color} size={size} />}
          color={theme.white}
          size={18}
        />
      ),
      thumbBgColor: theme.primary,
      action: () => {
        close()
        setTimeout(() => {
          pickImageHandler()
        }, 400)
      },
    },
    {
      title: 'Gif',
      thumbIcon: (
        <IconButton
          icon={({ size, color }) => <MaterialIcons name='gif' color={color} size={size} />}
          color={theme.white}
          size={22}
        />
      ),
      thumbBgColor: theme.primary,
      action: () => {
        close()
        setTimeout(pickGif, 400)
      },
    },
    {
      title: 'Embed Video',
      thumbIcon: (
        <IconButton
          icon={({ size, color }) => (
            <MaterialIcons name='video-library' color={color} size={size} />
          )}
          color={theme.white}
          size={22}
        />
      ),
      thumbBgColor: theme.primary,
      action: () => {
        close()
        setTimeout(onEmbedVideoHandler, 400)
      },
    },
    {
      title: 'Paid Message',
      thumbIcon: (
        <IconButton
          icon={({ size, color }) => <MaterialIcons name='message' color={color} size={size} />}
          color={theme.white}
          size={22}
        />
      ),
      thumbBgColor: theme.primary,
      action: () => {
        close()
        setTimeout(doPaidMessageHandler, 400)
      },
    },
  ]

  const conversationItems = [
    {
      title: 'Request',
      thumbIcon: (
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcons name='arrow-bottom-left' color={color} size={size} />
          )}
          color={theme.white}
          size={22}
        />
      ),
      thumbBgColor: theme.primary,
      action: () => {
        close()
        setTimeout(() => {
          requestHandler()
        }, 400)
      },
    },
    {
      title: 'Send',
      thumbIcon: (
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcons name='arrow-top-right' color={color} size={size} />
          )}
          color={theme.white}
          size={22}
        />
      ),
      thumbBgColor: theme.primary,
      action: () => {
        close()
        setTimeout(() => {
          sendHandler()
        }, 400)
      },
    },
  ]

  const userItems = []

  const items = isConversation
    ? [...commonItems, ...conversationItems]
    : [...commonItems, ...userItems]

  return useObserver(() => (
    <MenuSheet visible={visible} items={items} onCancel={close} noSwipe marginH={12} />
  ))
}
