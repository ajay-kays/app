import React, { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Alert, Dimensions, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Video from 'react-native-video'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { SCREEN_HEIGHT } from 'lib/constants'
import { View } from 'react-native'
import Button from '../common/Button'
import Typography from '../common/Typography'
import { useTheme } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const VIDEO_DURATION_SECONDS = 35

function SuggestToUserToBackupTheirKeys({ onDone, z, isTheMainRender, onRestore }) {
  const theme = useTheme()
  const network = require('../../assets/videos/back-up-keys.mov')
  const { isVideoDone, resetCounter, timeVideoCounter } = useCounterToVideo()

  const videoRef = useRef<any>(null)

  const restartVideo = () => {
    videoRef.current && videoRef.current.seek(0)
    resetCounter()
  }

  const forceFinishLoad = () => {
    Alert.alert(
      'Are you sure?',
      'This video explains the importance of backing up your keys, you should watch this!',
      [
        {
          text: 'Watch',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Skip', onPress: onDone },
      ]
    )
  }
  /**
   * Animation section
   */
  const WIDTH = 150
  const PROGRESS = Math.abs(timeVideoCounter - VIDEO_DURATION_SECONDS) / VIDEO_DURATION_SECONDS
  const progressWidth = useSharedValue(0)
  useEffect(() => {
    progressWidth.value = withSpring(PROGRESS * WIDTH)
  }, [PROGRESS, progressWidth.value, timeVideoCounter])

  const progressStyle = useAnimatedStyle(() => {
    return {
      // Set progressWidth as the width of our progress view
      width: progressWidth.value,
      height: 50,
    }
  })

  if (!isTheMainRender) return null
  return (
    <View style={{ zIndex: z }}>
      <Video
        source={network}
        resizeMode='cover'
        ref={(videoPlayer) => (videoRef.current = videoPlayer)}
        style={{
          height: SCREEN_HEIGHT,
        }}
      />
      <TouchableOpacity
        onPress={forceFinishLoad}
        style={{
          width: 32,
          height: 32,
          position: 'absolute',
          top: 32,
          left: 24,
          transform: [{ rotate: '45deg' }],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 32, lineHeight: 32 }}>+</Text>
      </TouchableOpacity>
      <View style={styles.buttonWrap}>
        <Button
          accessibilityLabel='onboard-name-button'
          style={{ marginRight: 10 }}
          onPress={restartVideo}
          disabled={false}
          w={32}
          color={theme.colors.primary}
        >
          <Icon name='repeat' color={'white'} size={32} />
        </Button>
        <View>
          {!isVideoDone && (
            <Animated.View
              style={[
                progressStyle,
                styles.absoluteViewAnimation,
                { backgroundColor: theme.colors.primary },
              ]}
            />
          )}
          <Button
            accessibilityLabel='onboard-name-button'
            onPress={onDone}
            disabled={!isVideoDone}
            style={{ ...styles.button }}
            w={WIDTH}
            size='large'
            color={theme.colors.primary}
          >
            <Typography color={'white'}>{isVideoDone ? 'Next' : timeVideoCounter}</Typography>
          </Button>
        </View>
      </View>
    </View>
  )
}

export default observer(SuggestToUserToBackupTheirKeys)

type UseCounterToVideo = () => {
  isVideoDone: boolean
  resetCounter: () => void
  timeVideoCounter: number
}
const useCounterToVideo: UseCounterToVideo = () => {
  const [timeVideoCounter, setTimeVideoCounter] = useState(VIDEO_DURATION_SECONDS)
  const [isVideoDone, setIsVideoDone] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeVideoCounter((prev) => prev - 1)
    }, 1000)
    if (timeVideoCounter <= 0) {
      setIsVideoDone(true)
      clearTimeout(timeoutId)
    }
    return () => clearTimeout(timeoutId)
  }, [timeVideoCounter])

  const resetCounter = useCallback(() => {
    setTimeVideoCounter(VIDEO_DURATION_SECONDS)
  }, [])

  return { isVideoDone, resetCounter, timeVideoCounter }
}

const styles = StyleSheet.create({
  buttonWrap: {
    position: 'absolute',
    bottom: 42,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: Dimensions.get('window').width * 0.25 - 10,
  },
  absoluteViewAnimation: {
    top: 0,
    left: 0,
    position: 'absolute',
    borderRadius: 25,
  },
  button: {
    marginRight: 20,
  },
})
