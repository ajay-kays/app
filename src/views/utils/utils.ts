import { decode as atob } from 'base-64'
import { Dimensions, Platform } from 'react-native'

import tags from './tags.json'

const base64Fields = ['imgurl']

export function jsonFromUrl(url): { [k: string]: any } {
  const qIndex = url.indexOf('?')
  var query = url.substr(qIndex + 1)
  var result = {}
  query.split('&').forEach(function (s) {
    const idx = s.indexOf('=')
    const k = s.substr(0, idx)
    const v = s.substr(idx + 1)
    if (base64Fields.includes(k)) {
      result[k] = atob(v)
    } else {
      result[k] = v
    }
  })
  return result
}

export function getTags(num = 6) {
  const newTags: any[] = []
  for (let i = 0; i < num; i++) {
    const random = Math.floor(Math.random() * tags.length)

    if (newTags.indexOf(tags[random]) !== -1) {
      continue
    }

    newTags.push(tags[random])
  }

  return newTags
}

export function isIphoneXorAbove() {
  const d = Dimensions.get('window')
  return (
    Platform.OS === 'ios' &&
    (d.height === 812 || d.width === 812 || d.height === 896 || d.width === 896)
  )
}

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
