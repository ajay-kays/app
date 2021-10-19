import { DEFAULT_HUB_API, DEFAULT_SHOP_API } from 'lib/config'
import API from './api'
import { connectWebSocket, registerWsHandlers } from './ws'
// import * as wsHandlers from '../store/websocketHandlers'

const invite = new API(DEFAULT_HUB_API, '', '')
const shop = new API(DEFAULT_SHOP_API, '', '')

let relay: API | null = null

export function instantiateRelay(
  ip: string,
  authToken?: string,
  connectedCallback?: Function,
  disconnectCallback?: Function,
  resetIPCallback?: Function
) {
  if (!ip) return console.log('cant instantiate Relay, no IP')

  if (relay) relay = null

  let protocol = 'http://'
  if (ip.endsWith('nodl.it')) {
    protocol = 'https://'
  }
  if (ip.endsWith('nodes.sphinx.chat')) {
    protocol = 'https://'
  }

  if (ip.startsWith('https://') || ip.startsWith('http://')) {
    protocol = ''
  }

  if (authToken) {
    relay = new API(`${protocol}${ip}/`, 'x-user-token', authToken, resetIPCallback)
  } else {
    relay = new API(`${protocol}${ip}/`)
  }
  console.log('=> instantiated relay!', `${protocol}${ip}/`, 'authToken?', authToken ? true : false)

  if (authToken) {
    // only connect here (to avoid double) if auth token means for real
    connectWebSocket(`${protocol}${ip}`, authToken, connectedCallback, disconnectCallback)
    console.log('Skipping WS handler registration')
    // registerWsHandlers(wsHandlers)
  }

  // registerHandler each msg type here?
  // or just one?
}

export function composeAPI(host: string, authToken?: string) {
  let api: API | null = null
  if (authToken) {
    api = new API(`https://${host}/`, 'Authorization', `Bearer ${authToken}`)
  } else {
    api = new API(`https://${host}/`)
  }

  return api
}

export { invite, relay, shop }
