import React, { useRef } from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { useTheme } from '../../../store'
import Typography from '../Typography'

export default function BoostButton({ onPress }) {
  const theme = useTheme()
  const size = useRef(new Animated.Value(1)).current
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
      style={{ ...styles.boostButton, borderColor: theme.primary }}
      rippleColor={theme.primary}
      onPress={go}
      borderless
    >
      <View style={{ ...styles.circle }}>
        <Animated.View
          style={{
            transform: [{ scale: size }],
          }}
        >
          <Ionicon name='rocket-outline' color={theme.primary} size={22} />
        </Animated.View>
        <Typography size={15} color={theme.primary} style={{ paddingHorizontal: 6 }}>
          Boost
        </Typography>
      </View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  boostButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    width: 100,
    height: 35,
  },
  circle: {
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
