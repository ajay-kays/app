import React from 'react'
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native'

import { useParsedGiphyMsg } from 'store/hooks/msg'
import shared from './sharedStyles'
import BoostRow from './boostRow'
import Typography from '../../common/Typography'

export default function GiphMessage(props) {
  const { message_content, showBoostRow, onLongPressHandler } = props
  const { url, aspectRatio, text } = useParsedGiphyMsg(message_content)

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={{ ...styles.wrap, maxWidth: 200 }}
      onLongPress={onLongPressHandler}
    >
      <Image
        source={{ uri: url }}
        style={{ width: 200, height: 200 / (aspectRatio || 1) }}
        resizeMode={'cover'}
      />

      <View style={shared.innerPad}>
        {(text ? true : false) && <Typography>{text}</Typography>}
        {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} marginTop={14} />}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    maxWidth: '100%',
  },
})
