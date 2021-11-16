import moment from 'moment'
import url from 'url'
import * as linkify from 'linkifyjs'
import { constants } from 'lib/constants'
import { hasWhiteSpace } from 'lib/utils'

export function calcExpiry(props) {
  const isInvoice = props.type === constants.message_types.invoice
  let expiry
  let isExpired = false
  if (isInvoice) {
    const exp = moment(props.expiration_date)
    const dif = exp.diff(moment())
    expiry = Math.round(moment.duration(dif).asMinutes())
    if (expiry < 0) isExpired = true
  }
  return { expiry, isExpired }
}

type Link = {
  href: string
}

const getLink =
  (linkFilter: (text: Link) => boolean) =>
  (text: string): string => {
    const messageLinks = linkify.find(text, 'url')
    const filteredLink = messageLinks.find(linkFilter)
    return filteredLink?.href ?? ''
  }
const isLinkWithStart = (textToStart: string) => (link: Link) => link.href.startsWith(textToStart)

const youtubeRegex =
  /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/

export const getRumbleLink = getLink(isLinkWithStart('https://rumble.com/embed/'))
export const getYoutubeLink = getLink((link) => youtubeRegex.test(link.href))
export const getYoutubeVideoID = (link: string) => {
  const matches = youtubeRegex.exec(link)
  return matches?.[1] ?? ''
}
export const getQueryParamFromLink = (link: string, queryParam: string) => {
  const urlParams = url.parse(link, true)
  return urlParams.query?.[queryParam] ?? ''
}

export const verifyPubKey = (messageContent: string): any => {
  if (!messageContent || messageContent.length <= 0) return false

  let isPubKey = false
  let pubKey = ''
  const words = messageContent.split(' ')

  const isValid = (text) => {
    return text.length === 66 && !hasWhiteSpace(text) && !text.startsWith('boost')
  }

  if (words.length === 1) {
    pubKey = words[0] || messageContent
    isPubKey = isValid(pubKey)
  } else {
    words.map((word) => {
      isPubKey = isValid(word)
      if (isPubKey) {
        pubKey = word
      }
    })
  }

  return { isPubKey, pubKey }
}

export const verifyCommunity = (messageContent: string): any => {
  if (!messageContent || messageContent.length <= 0) return false

  let isCommunity = false
  const words = messageContent.split(' ')

  //  TODO: n2n2 check is temporary (check old communities since n2n2)
  const isValid = (text) => {
    return (
      text.startsWith('zion.chat://?action=tribe') || text.startsWith('n2n2.chat://?action=tribe')
    )
  }

  if (words.length === 1) {
    isCommunity = isValid(messageContent)
  } else {
    words.map((word) => {
      isCommunity = isValid(word)
    })
  }

  return isCommunity
}
