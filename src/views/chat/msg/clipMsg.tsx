import React, { useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { useTheme } from '../../../store'
import { StreamPayment, NUM_SECONDS } from 'store/feed'
import { useParsedClipMsg } from '../../../store/hooks/msg'
import EE, { CLIP_PAYMENT } from 'lib/ee'
import shared from './sharedStyles'
import AudioPlayer from './audioPlayer'
import Typography from '../../common/Typography'

export default function ClipMessage(props) {
  const count = useRef(0)
  const theme = useTheme()
  const { message_content, uuid } = props

  const obj = useParsedClipMsg(message_content)
  const { url, title, text, ts, feedID, itemID, pubkey } = obj

  function onListenOneSecond(feedURL) {
    count.current = count.current + 1
    if (count.current && count.current % NUM_SECONDS === 0) {
      const sp: StreamPayment = {
        feedID,
        itemID,
        pubkey,
        ts: Math.round(count.current),
        uuid,
      }
      EE.emit(CLIP_PAYMENT, sp)
    }
  }
  return (
    <View style={{ ...shared.innerPad }}>
      {(title ? true : false) && <Typography size={12}>{title}</Typography>}
      <AudioPlayer source={url} jumpTo={ts || 0} onListenOneSecond={onListenOneSecond} />
      <Typography>{text}</Typography>
    </View>
  )
}

const styles = StyleSheet.create({})
