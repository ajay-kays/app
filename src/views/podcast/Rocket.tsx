import React, { useRef } from 'react'
import { Animated, View, StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { useTheme } from '../../store'
import CustomIcon from '../utils/customIcons'

export default function Rocket({ onPress }) {
  const theme = useTheme()
  const size = useRef(new Animated.Value(1)).current
  function go() {
    Animated.sequence([
      Animated.timing(size, {
        toValue: 2.5,
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
    <TouchableRipple style={styles.rocketWrap} rippleColor={theme.primary} onPress={go} borderless>
      <View style={{ ...styles.circle, backgroundColor: theme.primary }}>
        <Animated.View
          style={{
            transform: [{ scale: size }],
          }}
        >
          <CustomIcon name='fireworks' color={theme.white} size={20} />
        </Animated.View>
      </View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  rocketWrap: {
    height: 50,
    width: 50,
    borderRadius: 27,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  circle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
