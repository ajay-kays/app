import { useAvatarColor, useStores } from 'store'

export function useChatReply(msgs, replyUUID) {
  let replyMessage = msgs && replyUUID && msgs.find((m) => m.uuid === replyUUID)

  return {
    replyMessage,
  }
}

export function useReplyContent(msgs, replyUUID, extraTextContent): ReplyContent {
  const { contacts } = useStores()
  let replyMessageSenderAlias = ''
  let replyMessageContent = ''
  let replyMessageExtraContent = {}
  let replyColor = ''

  if (extraTextContent) {
    const { content, title, color } = makeExtraTextContent(extraTextContent)
    replyMessageSenderAlias = title
    replyMessageContent = content
    replyColor = color
  } else {
    const replyMsg = msgs && replyUUID && msgs.find((m) => m.uuid === replyUUID)
    replyMessageSenderAlias = replyMsg && replyMsg.sender_alias

    replyMessageExtraContent = replyMsg

    replyMessageContent =
      replyMsg && replyMsg.message_content ? replyMsg.message_content : replyMsg?.media_type

    if (!replyMessageSenderAlias && replyMsg && replyMsg.sender) {
      const sender = contacts.contactsArray.find((c) => c.id === replyMsg.sender)
      if (sender) replyMessageSenderAlias = sender.alias
    }
    replyColor = useAvatarColor(replyMessageSenderAlias)
  }
  return {
    replyMessageSenderAlias,
    replyMessageContent,
    replyMessageExtraContent,
    replyColor,
  }
}

export function calcBotPrice(bots: Array<BotJSON>, text: string): CalcBotPriceResponse {
  let price = 0
  let failureMessage = ''
  if (!bots) {
    return { price, failureMessage }
  }
  bots.forEach((b) => {
    if (!text.startsWith(b.prefix)) return // skip this bot if not right prefix
    if (b.price && b.price > 0) {
      price = b.price
    }
    if (b.commands && Array.isArray(b.commands)) {
      const arr = text.split(' ') // array of words in the message
      if (arr.length < 2) return
      b.commands.forEach((cmd) => {
        const theCommand = arr[1] // the "command" is the second item in the array
        if (cmd.command !== '*' && theCommand !== cmd.command) return // skip if wrong command (* means any)

        if (cmd.price) {
          // get the price from the command config
          price = cmd.price
        } else if (cmd.price_index) {
          // calculate the price from the actual command text
          if (arr.length - 1 < cmd.price_index) return // skip if not enough words in the message
          const amount = parseInt(arr[cmd.price_index])
          if (cmd.min_price && amount < cmd.min_price) {
            failureMessage = 'Amount too low' // min amount
            return
          }
          if (cmd.max_price && amount > cmd.max_price) {
            failureMessage = 'Amount too high' // max amount
            return
          }
          price = amount
        }
      })
    }
  })
  return { price, failureMessage }
}

function makeExtraTextContent(obj) {
  const content = obj.ts || obj.ts === 0 ? `Share audio clip: ${toHHMMSS(obj.ts)}` : 'Content'
  const title = obj.title || 'Title'
  return { content, title, color: 'grey' }
}

function toHHMMSS(ts) {
  var sec_num = parseInt(ts, 10) // don't forget the second param
  var hours: any = Math.floor(sec_num / 3600)
  var minutes: any = Math.floor((sec_num - hours * 3600) / 60)
  var seconds: any = sec_num - hours * 3600 - minutes * 60
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return hours + ':' + minutes + ':' + seconds
}

interface BotCommand {
  command: string
  price: number
  min_price: number
  max_price: number
  price_index: number
  admin_only: boolean
}

interface BotJSON {
  prefix: string
  price: number
  commands: BotCommand[] | null
}

interface CalcBotPriceResponse {
  price: number
  failureMessage: string
}

interface ReplyContent {
  replyMessageSenderAlias: string
  replyMessageContent: string
  replyColor: string
  replyMessageExtraContent: {}
}
