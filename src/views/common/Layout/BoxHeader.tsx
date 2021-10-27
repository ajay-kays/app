import React from 'react'
import { StyleSheet, View } from 'react-native'
import Typography from '../Typography'

export default function BoxHeader(props) {
  const { title, children, fs } = props
  return (
    <View style={{ ...styles.wrap }}>
      <Typography size={fs ? fs : 18}>{title}</Typography>
      <>{children}</>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
