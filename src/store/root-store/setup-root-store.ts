import { onSnapshot } from 'mobx-state-tree'
import { RootStoreModel, RootStore } from './root-store'
import { Environment } from '../environment'
// import * as storage from '../../utils/storage'
import storage from '@react-native-async-storage/async-storage'
import { initialLoad, updateRealmMsg } from 'services/realm/exports'
import { display } from 'lib/logging'

/**
 * The key we'll be saving our state as within async storage.
 */
export const ROOT_STATE_STORAGE_KEY = 'ROOT-117-3'

/**
 * Setup the environment that all the models will be sharing.
 *
 * The environment includes other functions that will be picked from some
 * of the models that get created later. This is how we loosly couple things
 * like events between models.
 */
export async function createEnvironment() {
  const env = new Environment()
  await env.setup()
  return env
}

/**
 * Setup the root state.
 */
export async function setupRootStore() {
  let rootStore: RootStore
  let data: any
  // prepare the environment that will be associated with the RootStore.
  const env = await createEnvironment()
  rootStore = RootStoreModel.create({}, env)
  try {
    // load data from storage
    data = (await storage.getItem(ROOT_STATE_STORAGE_KEY)) || {}
    // if (data && data.msg && data.msg.messages) {
    //   delete data.msg.messages
    //   console.log('DELETED MESSAGES EHEHEHE')
    // }
    rootStore = RootStoreModel.create(JSON.parse(data), env)
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    rootStore = RootStoreModel.create({}, env)

    // but please inform us what happened
    console.log(e)
    // __DEV__ && console.tron.error(e.message, null)
  }

  rootStore.ui.setRestoringModal(false)

  // reactotron logging
  if (__DEV__) {
    env.reactotron.setRootStore(rootStore, data)
  }

  let lastSaved = new Date()
  let secondsSinceLastSent: number | null = null
  let SAVE_INTERVAL = 6
  let numMessagesLastUpdated = 0

  // track changes & save to storage
  onSnapshot(rootStore, (snapshot) => {
    // LETS BLOW AWAY THE ENTIRE MESSAGE BUFFER - except a chatroom/community we're actively looking at
    // rootStore.msg.setMessages({})

    // if (snapshot.msg.messages) {
    //   snapshot.msg.messages = {}
    // }

    // const snapshotMinusMessages = {
    //   ...snapshot,
    //   msg: {
    //     ...snapshot.msg,
    //     messages: {},
    //   },
    // }

    // display({
    //   name: 'onSnapshot',
    //   // important: true,
    //   value: { snapshot }, // , snapshotMinusMessages
    // })
    const now = new Date()
    const dif = now.getTime() - lastSaved.getTime()
    secondsSinceLastSent = dif / 1000

    if (!lastSaved || secondsSinceLastSent > SAVE_INTERVAL) {
      lastSaved = new Date()
      storage.setItem(ROOT_STATE_STORAGE_KEY, JSON.stringify(snapshot)) //   snapshotMinusMessages

      // const len = rootStore.msg.lengthOfAllMessages()
      // if (len > numMessagesLastUpdated) {
      //   const updateRealmWith = {
      //     messages: rootStore.msg.messages,
      //     lastSeen: rootStore.msg.lastSeen,
      //     lastFetched: Date.now(),
      //   }
      //   updateRealmMsg(updateRealmWith)
      //   numMessagesLastUpdated = len
      // } else {
      //   display({
      //     name: 'onSnapshot',
      //     preview: `Skipping realm update - ${len} messages in both realm and store`,
      //   })
      // }

      console.log('Saved', lastSaved)
    }
  })

  initialLoad({
    contacts: rootStore.contacts.contactsArray,
    chats: rootStore.chats.chatsArray,
    msg: rootStore.msg,
  })

  return rootStore
}
