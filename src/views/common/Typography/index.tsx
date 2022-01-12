import React from 'react'
import { Text } from 'react-native'

import { useTheme } from '../../../store'

export default function Typography(props) {
  const theme = useTheme()

  let {
    children,
    style,
    color = theme.text,
    bg,
    size,
    fw,
    ls = 0.5,
    lh,
    textAlign,
    numberOfLines,
    allowFontScaling,
    onPress,
  } = props

  let lineHeight = 20
  if (size >= 15 && size < 20) {
    lineHeight = 26
  } else if (size >= 20) {
    lineHeight = 40
  } else {
    lineHeight = 20
  }
  return (
    <Text
      allowFontScaling={allowFontScaling}
      onPress={onPress}
      style={{
        ...style,
        color,
        backgroundColor: bg,
        fontSize: size,
        fontWeight: fw,
        letterSpacing: ls,
        lineHeight: lh ? lh : lineHeight,
        textAlign,
        fontFamily: fw === 700 ? 'Montserrat-Bold' : 'Montserrat-Regular',
      }}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  )
}

Typography.defaultProps = {}
