import React from 'react'
import { View } from 'react-native'
import Canvas from './canvas'

export default function QRCode(props) {
  const size = props.size || 250
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
      }}
    >
      <Canvas
        value={utf16to8(props.value)}
        size={size}
        style={{
          height: 180,
          width: 180,
          minWidth: 40,
          minHeight: 40,
          maxWidth: 200,
        }}
      />
    </View>
  )
}

function utf16to8(str) {
  var out, i, len, c
  out = ''
  len = str.length
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i)
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f))
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f))
    }
  }
  return out
}
