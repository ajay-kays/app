import { decodeMessages } from 'store/msg-store'
import { normalizeMessage } from 'store/normalize'
import { Msg } from '../msg-models'
import { MsgStore } from '../msg-store'
import { display, log } from 'lib/logging'
import { orgMsgs } from '../msg-helpers'

export const batchDecodeMessages = async (self: MsgStore, msgs: Msg[]) => {
  display({
    name: 'batchDecodeMessages',
    preview: `Batch decoding ${msgs.length} messages [getMessages2]`,
    value: { msgs },
  })

  self.setLastFetched(new Date().getTime())
  const decodedMsgs = await decodeMessages(msgs)

  // const first10 = msgs.slice(msgs.length - 10)
  // const rest = msgs.slice(0, msgs.length - 10)
  // const decodedMsgs = await decodeMessages(first10)

  let messagesToSave: any[] = []
  decodedMsgs.forEach((msg) => {
    const normalizedMessage = normalizeMessage(msg)
    normalizedMessage && messagesToSave.push(normalizedMessage)
  })

  display({
    name: 'batchDecodeMessages',
    preview: `About to call setMessages with...`,
    value: { messagesToSave },
    important: true,
  })

  const formattedMessages = orgMsgs(messagesToSave)
  self.setMessages(formattedMessages)
  // self.setMessagesOld(messagesToSave)

  // messagesToSave = []
  // const decodedRest = await decodeMessages(rest)

  // decodedRest.forEach((msg) => {
  //   const normalizedMessage = normalizeMessage(msg)
  //   messagesToSave.push(normalizedMessage)
  // })
  // self.setMessages(messagesToSave)

  return true
}
