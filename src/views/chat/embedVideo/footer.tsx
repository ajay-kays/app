import React from 'react'
import { View } from 'react-native'
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import { useTheme } from 'store'

const Footer = () => {
  const theme = useTheme()

  return (
    <View
      style={{
        backgroundColor: theme.main,
        paddingBottom: isIphoneX() ? getBottomSpace() : 5,
      }}
    />
  )
}

export default Footer
