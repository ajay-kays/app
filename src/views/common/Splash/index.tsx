import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { useDarkMode } from 'react-native-dynamic'
import Wobble from '../Animations/Wobble'

export default function Splash() {
  const isDarkMode = useDarkMode()
  return (
    <View
      style={{
        ...styles.wrap,
        backgroundColor: isDarkMode ? '#141d26' : '#fff',
      }}
    >
      {/* <Wobble>
        <Image
          source={require('../../../assets/n2n2.png')}
          style={{ width: 140, height: 140 }}
          resizeMode={'contain'}
        />
      </Wobble> */}

      <Image
        source={
          isDarkMode
            ? require('../../../assets/Zion-Logo-White.png')
            : require('../../../assets/Zion-Logo-Blue.jpg')
        }
        style={{ width: 120, height: 120 }}
        resizeMode={'contain'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
