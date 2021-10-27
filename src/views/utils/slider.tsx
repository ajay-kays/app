import React, { useEffect, useState } from 'react'
import { StyleSheet, Animated, Dimensions } from 'react-native'
import { useTheme } from 'store'

export default function Slider(props) {
  const screenWidth = Math.ceil(Dimensions.get('window').width)
  const w = new Animated.Value(screenWidth)
  const [x] = useState(w)
  const theme = useTheme()

  useEffect(() => {
    if (props.show) {
      Animated.timing(x, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(x, {
        toValue: screenWidth,
        duration: 600,
        useNativeDriver: true,
      }).start()
    }
  }, [props.show])

  const addedStyles = props.style || {}

  return (
    <Animated.View
      accessibilityLabel={props.accessibilityLabel || 'slider'}
      style={{
        ...styles.wrap,
        backgroundColor: theme.bg,
        zIndex: props.z || 1,
        transform: [{ translateX: x }],
        ...addedStyles,
      }}
    >
      {props.children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
