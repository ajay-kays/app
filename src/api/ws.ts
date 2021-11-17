import socketio from 'socket.io-client'
import { reportError } from 'lib/errorHelper'
import { display } from 'lib/logging'
import { Alert } from 'react-native'
import Toast from 'react-native-simple-toast'
import { useStores } from 'store'

type WSMessage = { [k: string]: any }

type DataHandler = (data: any) => void

let handlers: { [k: string]: DataHandler } = {}

export function registerWsHandlers(hs: { [k: string]: DataHandler }) {
  handlers = hs
}

let io: any = null

export function connectWebSocket(
  ip: string,
  authToken: string,
  connectedCallback?: Function,
  disconnectCallback?: Function
) {
  if (io) {
    return // dont reconnect if already exists
  }

  io = socketio.connect(ip, {
    reconnection: true,
    transportOptions: {
      polling: {
        extraHeaders: {
          'x-user-token': authToken,
        },
      },
    },
  })

  io.on('connect', (socket) => {
    console.log('=> socketio connected!')
    if (connectedCallback) connectedCallback()
  })

  io.on('disconnect', (socket) => {
    if (disconnectCallback) disconnectCallback()
  })

  io.on('message', (data) => {
    display({
      name: 'message',
      important: true,
      preview: 'Websocket message received',
      value: data,
    })
    try {
      let msg: WSMessage = JSON.parse(data)
      let typ = msg.type
      if (typ === 'delete') typ = 'deleteMessage'
      let handler = handlers[typ]
      if (handler) {
        handler(msg)
      }
    } catch (e) {
      console.log(e)
      reportError(e)
    }
  })

  io.on('error', function (e) {
    console.log('socketio error', e)
    reportError(e)
    if (e === 'authentication error') {
      console.log('ATTEMPTING THIS')

      let handler = handlers['errorAuth']
      if (handler) {
        handler('errorAuth')
      }

      Toast.showWithGravity('Authentication error! Please log in again.', Toast.LONG, Toast.CENTER)
      // const root = useStores()
      // console.log('GOT ROOT?')
      // root.reset()
    }
  })
}
