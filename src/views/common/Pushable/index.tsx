import React, { useState } from 'react'
import { Animated, TouchableWithoutFeedback } from 'react-native'

export default function Pushable({ children, onPress, scale }) {
  const [pressAnim] = useState(new Animated.Value(1))

  const pressAnimation = () => {
    Animated.timing(pressAnim, {
      toValue: scale,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }

  const releaseAnimation = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }

  return (
    <TouchableWithoutFeedback
      onPressIn={pressAnimation}
      onPressOut={releaseAnimation}
      onPress={onPress}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale: pressAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

Pushable.defaultProps = {
  scale: 0.8,
}
