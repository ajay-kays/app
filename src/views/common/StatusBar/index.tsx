import React from 'react'
import { StyleSheet, Platform, StatusBar, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight

type BarStyle = 'default' | 'light-content' | 'dark-content'

const GeneralStatusBarColor = (props) => {
  const { primary } = props
  let backgroundColor = 'white'
  let barStyle: BarStyle = 'dark-content'
  if (primary) {
    backgroundColor = '#6289FD'
    barStyle = 'light-content'
  }
  return (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <StatusBar translucent backgroundColor={backgroundColor} barStyle={barStyle} />
    </View>
  )
}

const styles = StyleSheet.create({
  statusBar: {
    // height: STATUSBAR_HEIGHT
  },
})

export default GeneralStatusBarColor

type Tint = 'light' | 'dark' | 'black'

export function setTint(s: Tint = 'light') {
  if (s === 'light') {
    StatusBar.setBarStyle('dark-content')
  } else if (s === 'dark') {
    StatusBar.setBarStyle('light-content')
  } else {
    StatusBar.setBarStyle('light-content')
  }
}
