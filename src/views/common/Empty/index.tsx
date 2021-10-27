import React from 'react'

import { View, StyleSheet } from 'react-native'

import { useTheme } from '../../../store'
import Typography from '../Typography'

export default function Empty(props) {
  const theme = useTheme()
  console.log('EMPTY')
  const {
    text,
    style,
    h,
    w,
    ml,
    mr,
    color = theme.dark ? theme.white : theme.darkGrey,
    children,
  } = props

  const emptyBox = {
    display: 'flex',
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: h ? h : 100,
    width: w ? w : '100%',
    marginLeft: w ? 'auto' : ml,
    marginRight: w ? 'auto' : mr,
  }

  return (
    <View style={{ ...styles.wrap, ...style, ...emptyBox }}>
      {text && <Typography color={color}>{text}</Typography>}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
  },
})
