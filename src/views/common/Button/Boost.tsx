import React, { useRef } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { useTheme } from '../../../store'
import CustomIcon from 'lib/customIcons'

export default function Boost(props) {
  const theme = useTheme()
  const size = useRef(new Animated.Value(1)).current
  const {
    onPress,
    bg = theme.primary,
    color = theme.white,
    rippleColor = theme.primary,
    circleH = 35,
    circleW = 35,
    rippleH = 45,
    rippleW = 45,
    rocketSize = 18,
  } = props

  function go() {
    Animated.sequence([
      Animated.timing(size, {
        toValue: 1.5,
        duration: 75,
        useNativeDriver: true,
      }),
      Animated.timing(size, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
    onPress()
  }

  return (
    // @ts-ignore
    <TouchableRipple
      style={{ ...styles.rocketWrap, height: rippleH, width: rippleW }}
      rippleColor={rippleColor}
      onPress={go}
      borderless
    >
      <View
        style={{
          ...styles.circle,
          backgroundColor: bg,
          height: circleH,
          width: circleW,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: size }],
          }}
        >
          <Ionicon name='rocket-outline' color={color} size={rocketSize} />
        </Animated.View>
      </View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  rocketWrap: {
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
