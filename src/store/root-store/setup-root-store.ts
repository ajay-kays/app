import { onSnapshot } from 'mobx-state-tree'
import { RootStoreModel, RootStore } from './root-store'
import { Environment } from '../environment'
// import * as storage from '../../utils/storage'
import storage from '@react-native-async-storage/async-storage'

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = 'ROOT'

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
    rootStore = RootStoreModel.create(JSON.parse(data), env)
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    rootStore = RootStoreModel.create({}, env)

    // but please inform us what happened
    console.log(e)
    // __DEV__ && console.tron.error(e.message, null)
  }

  // reactotron logging
  if (__DEV__) {
    env.reactotron.setRootStore(rootStore, data)
  }

  let lastSaved = new Date()
  let secondsSinceLastSent: number | null = null
  let SAVE_INTERVAL = 5

  // track changes & save to storage
  onSnapshot(rootStore, (snapshot) => {
    const now = new Date()
    const dif = now.getTime() - lastSaved.getTime()
    secondsSinceLastSent = dif / 1000

    if (!lastSaved || secondsSinceLastSent > SAVE_INTERVAL) {
      lastSaved = new Date()
      storage.setItem(ROOT_STATE_STORAGE_KEY, JSON.stringify(snapshot))
      console.log('Saved', lastSaved)
    }
  })

  return rootStore
}
