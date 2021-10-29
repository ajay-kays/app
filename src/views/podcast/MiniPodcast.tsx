import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TrackPlayer from 'react-native-track-player'
import FastImage from 'react-native-fast-image'
import { useTheme } from '../../store'
import CustomIcon from '../utils/customIcons'
import TouchableIcon from '../utils/touchableIcon'
import useInterval from '../utils/useInterval'
import { getPosition } from './Position'
import Typography from '../common/Typography'
import Boost from '../common/Button/Boost'

export default function MinPodcast({
  duration,
  episode,
  onToggle,
  playing,
  onShowFull,
  boost,
  loading,
  podError,
  pod,
}) {
  const theme = useTheme()
  const [pos, setPos] = useState(0)

  useEffect(() => {
    const p = getPosition()
    if (p !== pos) setPos(p)
  }, [])

  useInterval(() => {
    const p = getPosition()
    if (p !== pos) setPos(p)
  }, 1000)

  function getProgress() {
    if (!duration || !pos) return 0
    return pos / duration
  }

  async function fastForward() {
    const P = getPosition()
    TrackPlayer.seekTo(P + 30)
    setPos(P)
  }

  const height = 60

  if (loading || podError) {
    return (
      <View
        style={{
          ...styles.wrap,
          backgroundColor: theme.bg,
          borderTopColor: theme.border,
          height,
        }}
      >
        <View style={styles.inner}>
          <View style={styles.title}>
            <ActivityIndicator
              animating={true}
              color={theme.primary}
              size={13}
              style={{ marginLeft: 14 }}
            />
            <Typography style={{ marginLeft: 14, maxWidth: '100%' }} numberOfLines={1}>
              {podError ? 'Error loading podcast' : 'loading...'}
            </Typography>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View
      style={{
        ...styles.wrap,
        backgroundColor: theme.bg,
        borderTopColor: theme.border,
        height,
      }}
    >
      <TouchableOpacity activeOpacity={0.6} onPress={onShowFull} style={styles.touchable}>
        <View style={styles.inner}>
          <View style={styles.image}>
            <FastImage
              source={{ uri: episode.image || pod.image }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
              resizeMode={'cover'}
            />
          </View>
          <View style={styles.title}>
            <Typography style={{ marginLeft: 10, maxWidth: '100%' }} numberOfLines={1}>
              {episode.title}
            </Typography>
          </View>
          <View style={styles.iconz}>
            <TouchableOpacity
              onPress={onToggle}
              style={{
                ...styles.play,
              }}
            >
              <MaterialCommunityIcons
                name={playing ? 'pause-circle' : 'play-circle'}
                size={40}
                color={theme.primary}
              />
            </TouchableOpacity>
            <TouchableIcon rippleColor={theme.grey} size={42} onPress={fastForward}>
              <CustomIcon size={26} name='forward-30' color={theme.title} />
            </TouchableIcon>
            <Boost onPress={boost} />
            {/* <Rocket onPress={boost} /> */}
          </View>
        </View>
        <View style={styles.progressWrap}>
          <View
            style={{
              width: `${getProgress() * 100}%`,
              ...styles.progress,
              backgroundColor: theme.primary,
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    width: '100%',
    zIndex: 150,
    borderTopWidth: 1,
    display: 'flex',
  },
  touchable: {
    display: 'flex',
    flex: 1,
  },
  inner: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: 50,
    height: 50,
    marginLeft: 10,
    paddingVertical: 4,
  },
  title: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconz: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingRight: 10,
  },
  play: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 15,
    marginLeft: 5,
  },
  progressWrap: {
    width: '100%',
    height: 3,
  },
  progress: {
    height: 3,
  },
})
