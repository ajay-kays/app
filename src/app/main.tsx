import React, { useRef, useEffect, useState } from 'react'
import { AppState, Platform } from 'react-native'
import Toast from 'react-native-simple-toast'
import { checkVersion } from 'react-native-check-version'
import { getVersion, getBundleId } from 'react-native-device-info'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { useChats, useStores } from 'store'
// import { useApn } from './store/contexts/apn'
import { TOAST_DURATION } from 'lib/constants'
import { navigate } from 'nav'
import * as utils from 'views/utils/utils'
import { initPicSrc } from 'views/utils/picSrc'
import * as rsa from 'lib/crypto/rsa'
import EE, { RESET_IP_FINISHED } from 'lib/ee'
import { Modals } from 'views/modals'
import Dialogs from 'views/common/Dialogs'
import AppVersionUpdate from 'views/common/Dialogs/AppVersion'
import ModalsN from 'views/common/Modals'
import Root from 'nav/root-navigator'
import { display } from 'lib/logging'
import { useApn } from 'store/contexts/apn'

export default function Main() {
  const { contacts, msg, details, user, meme, ui } = useStores()
  const [versionUpdateVisible, setVersionUpdateVisible] = useState(false)
  const [chatID, setChatID] = useState(null)
  const chats = useChats()
  const apn = useApn()

  const appState = useRef(AppState.currentState)

  useEffect(() => {
    const listener = AppState.addEventListener('change', handleAppStateChange)
    return () => {
      listener.remove()
    }
  }, [])

  function handleAppStateChange(nextAppState) {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      loadHistory()
    }
    if (appState.current.match(/active/) && nextAppState === 'background') {
      const count = msg.countUnseenMessages(user.myid)

      if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(count)
      }
    }

    appState.current = nextAppState
  }

  function showToast(msg) {
    Toast.showWithGravity(msg, TOAST_DURATION, Toast.CENTER)
  }

  async function createPrivateKeyIfNotExists(contacts, user) {
    // const priv = null
    const priv = await rsa.getPrivateKey()
    const me = contacts.contactsArray.find((c) => c.id === user.myid)

    // display({
    //   name: 'createPrivateKeyIfNotExists',
    //   important: true,
    //   value: { priv, me },
    // })

    // private key has been made
    if (priv) {
      // display({
      //   name: 'createPrivateKeyIfNotExists',
      //   important: true,
      //   preview: 'Yes priv.',
      // })
      // set into user.contactKey
      if (me?.contact_key && !user.contactKey) {
        // display({
        //   name: 'createPrivateKeyIfNotExists',
        //   important: true,
        //   preview: 'Setting user contact key to',
        //   value: me.contact_key,
        // })
        user.setContactKey(me.contact_key)
        contacts.updateContact(user.myid, {
          contact_key: me.contact_key,
        })
        // set into me Contact
      } else if (user.contactKey) {
        // display({
        //   name: 'createPrivateKeyIfNotExists',
        //   important: true,
        //   preview: 'Just updating w',
        //   value: user.contactKey,
        // })
        contacts.updateContact(user.myid, {
          contact_key: user.contactKey,
        })
      } else {
        // need to regen :(
        display({
          name: 'createPrivateKeyIfNotExists',
          important: true,
          preview: 'regenning',
        })
        const keyPair = await rsa.generateKeyPair()
        display({
          name: 'createPrivateKeyIfNotExists',
          important: true,
          preview: 'regenned',
          value: { keyPair },
        })
        user.setContactKey(keyPair.public)
        contacts.updateContact(user.myid, {
          contact_key: keyPair.public,
        })

        display({
          name: 'createPrivKeyIfNot..',
          preview: 'generated new keypair!!! ??',
          important: true,
        })
      }
      // no private key!!
    } else {
      const keyPair = await rsa.generateKeyPair()
      user.setContactKey(keyPair.public)
      contacts.updateContact(user.myid, {
        contact_key: keyPair.public,
      })
      showToast('generated key pair')
    }
  }

  async function loadHistory(skipLoadingContacts?: boolean) {
    display({
      name: 'loadHistory',
      preview: `In loadHistory w skipLoadingContacts ${skipLoadingContacts}`,
      important: true,
    })

    ui.setLoadingHistory(true)

    if (!skipLoadingContacts) {
      await contacts.getContacts()
    }

    await msg.getMessages2()
    // await msg.getDirectMessages() // should we wait for this or not

    await sleep(500)
    details.getBalance()
    await sleep(500)
    meme.authenticateAll()

    // await msg.getRecentMessages()
    msg.initLastSeen()
    ui.setLoadingHistory(false)
  }

  useEffect(() => {
    ;(async () => {
      await contacts.getContacts()
      loadHistory(true)
      initPicSrc()
      createPrivateKeyIfNotExists(contacts, user)
    })()

    EE.on(RESET_IP_FINISHED, loadHistory)
    return () => {
      EE.removeListener(RESET_IP_FINISHED, loadHistory)
    }
  }, [])

  useEffect(() => {
    if (chatID) {
      const chat = chats.find((c) => c.id === chatID)
      if (chat) {
        navigate('Chat', { ...chat })
        setChatID(null)
      }
    }
  }, [chatID])

  useEffect(() => {
    ;(async () => {
      apn.configure(
        (token) => {
          if ((token && !user.deviceId) || user.deviceId !== token) {
            user.registerMyDeviceId(token, user.myid)
          }
        },
        (notification) => {
          const id = notification.data.aps.alert.action

          if (notification.userInteraction && notification.finish) {
            if (id) {
              setChatID(id)
            }
          }
          // const count = msg.countUnseenMessages(user.myid)
          // PushNotificationIOS.setApplicationIconBadgeNumber(count)

          PushNotificationIOS.setApplicationIconBadgeNumber(0)
          notification.finish(PushNotificationIOS.FetchResult.NoData)
        }
      )

      const currentVersion = getVersion()
      const bundleId = getBundleId()

      const version = await checkVersion({
        bundleId,
        currentVersion: currentVersion.toString(),
      })

      await utils.sleep(300)
      if (version.needsUpdate) {
        setVersionUpdateVisible(true)
        console.log(`App has a ${version.updateType} update pending.`)
      }
    })()
  }, [])

  return (
    <>
      <Root />
      <Modals />
      <ModalsN />
      <Dialogs />
      <AppVersionUpdate
        visible={versionUpdateVisible}
        close={() => setVersionUpdateVisible(false)}
      />
    </>
  )
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
