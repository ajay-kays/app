import { display } from 'lib/logging'
import { normalizeMessage } from 'store/normalize'
import { decodeSingle } from '../msg-helpers'
import { MsgStore } from '../msg-store'

export const gotNewMessageFromWS = async (self: MsgStore, m: any) => {
  // display({
  //   name: 'gotNewMessageFromWS',
  //   preview: `Ignoring message from WS - ${m?.id}`,
  //   value: { m },
  // })

  let newMsg = await decodeSingle(m)
  const normalizedMessage = normalizeMessage(newMsg)

  display({
    name: 'gotNewMessageFromWS',
    preview: `Decoded and normalized message ${normalizedMessage?.id}`,
    value: { m, decoded: newMsg, normalizedMessage },
  })

  normalizedMessage && self.setMessage(normalizedMessage)
}
