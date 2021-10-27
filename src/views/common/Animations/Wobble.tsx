import React, { useEffect } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'

const ANGLE = 360
const TIME = 600
const EASING = Easing.linear

export default function Wobble({ children }) {
  const rotation = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    }
  })

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(ANGLE, {
        duration: TIME,
        easing: EASING,
      }),
      1,
      true
    )
  }, [])

  return <Animated.View style={[animatedStyle]}>{children}</Animated.View>
}
