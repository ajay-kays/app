import moment from 'moment'
import url from 'url'
import * as linkify from 'linkifyjs'
import { constants } from 'lib/constants'

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
