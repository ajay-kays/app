import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import TrackPlayer from 'react-native-track-player'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Slider from '@react-native-community/slider'
import { StreamPayment } from '../../store/feed'
import EE, { EXTRA_TEXT_CONTENT } from 'lib/ee'
import TouchableIcon from '../utils/touchableIcon'
import CustomIcon from '../utils/customIcons'
import useInterval from '../utils/useInterval'
import { getPosition, setPosition } from './Position'
import Typography from '../common/Typography'

momentDurationFormatSetup(moment)

export default function Controls(props) {
  const [pos, setPos] = useState(0)
  const [selectSpeed, setSelectSpeed] = useState(false)

  useEffect(() => {
    const p = getPosition()
    if (p !== pos) setPos(p)
  }, [])

  useInterval(() => {
    const p = getPosition()
    if (p !== pos) setPos(p)
  }, 1000)

  async function fastForward() {
    const n = pos + 30
    await TrackPlayer.seekTo(n)
    setPosition()
    setPos(n)
  }
  async function rewind() {
    const n = pos < 15 ? 0 : pos - 15
    await TrackPlayer.seekTo(n)
    setPosition()
    setPos(n)
  }
  function feedClip() {
    const { episode: ep, pod, quoteCallback } = props
    if (!ep || !pod) return
    const obj: StreamPayment = {
      ts: pos,
      itemID: ep.id,
      feedID: pod.id,
      title: ep.title,
      url: ep.enclosureUrl,
      type: 'clip',
    }
    if (props.myPubkey) obj.pubkey = props.myPubkey
    EE.emit(EXTRA_TEXT_CONTENT, obj)
    if (quoteCallback) quoteCallback()
  }
  async function track(ratio) {
    const { duration } = props
    if (duration) {
      const secs = Math.round(duration * (ratio / 100))
      await TrackPlayer.seekTo(secs)
      setPosition()
      setPos(secs)
    }
  }
  function getProgress() {
    if (!props.duration || !pos) return 0
    return pos / props.duration
  }

  function doSelectSpeed(s: string) {
    setSelectSpeed(false)
    props.setRate(s)
  }

  const { theme, onToggle, playing, duration } = props

  const ratez = ['0.5', '0.8', '1', '1.2', '1.5', '2.1']

  // @ts-ignore
  const progressText = moment.duration(pos, 'seconds').format('hh:mm:ss')
  // @ts-ignore
  const durationText = moment.duration(duration, 'seconds').format('hh:mm:ss')
  return (
    <View style={styles.progressWrap}>
      <View style={styles.barWrap}>
        <View style={styles.progressBarWrap}>
          {/* <ProgressBar color="#6289FD"
              progress={this.getProgress()}
            // buffered={this.getBufferedProgress()}
            /> */}
          <Slider
            minimumValue={0}
            maximumValue={100}
            value={getProgress() * 100}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.primary}
            thumbTintColor={theme.primary}
            onSlidingComplete={track}
          />
        </View>
        <Typography size={13} style={{ ...styles.progressText }}>
          {progressText}
        </Typography>
        <Typography size={13} style={{ ...styles.durationText }}>
          {durationText}
        </Typography>
      </View>

      {!selectSpeed && (
        <View style={styles.speedWrap}>
          <View style={styles.speedWrapInner}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.speedClickable}
              onPress={() => setSelectSpeed(true)}
            >
              <Typography color={theme.subtitle} size={14}>
                {`${props.speed || '1'}x`}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {selectSpeed && (
        <View style={styles.selectSpeed}>
          <View style={styles.selectSpeedInner}>
            {ratez.map((s) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.6}
                  key={s}
                  onPress={() => doSelectSpeed(s)}
                  style={{
                    ...styles.speedBubble,
                    backgroundColor: s === props.speed ? theme.primary : theme.deep,
                  }}
                >
                  <Typography
                    size={12}
                    color={s === props.speed ? theme.white : theme.text}
                  >{`${s}x`}</Typography>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      )}

      <View style={styles.progressWrapBottom}>
        <View
          style={{
            height: 55,
            width: 50,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {/* <Rocket onPress={props.boost} /> */}
        </View>
        <View style={styles.controls}>
          <TouchableIcon rippleColor={theme.grey} size={48} onPress={rewind}>
            <CustomIcon name='back-15' color={theme.title} size={28} />
          </TouchableIcon>
          <TouchableOpacity
            onPress={onToggle}
            style={{
              marginLeft: 18,
              marginRight: 18,
            }}
          >
            <MaterialCommunityIcons
              name={playing ? 'pause-circle' : 'play-circle'}
              size={52}
              color={theme.primary}
            />
          </TouchableOpacity>
          <TouchableIcon rippleColor={theme.grey} size={48} onPress={fastForward}>
            <CustomIcon name='forward-30' color={theme.title} size={28} />
          </TouchableIcon>
        </View>

        <View style={{ height: 48, width: 50 }}>
          <TouchableIcon rippleColor={theme.grey} size={48} onPress={feedClip}>
            <CustomIcon name='chat-quote' color={theme.icon} size={24} />
          </TouchableIcon>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  controls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressWrap: {
    display: 'flex',
    width: '100%',
    // marginTop: 5
  },
  speedWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  speedWrapInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedClickable: {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  selectSpeed: {
    height: 50,
    width: '100%',
    position: 'relative',
    paddingTop: 22,
  },
  selectSpeedInner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedBubble: {
    width: 36,
    height: 26,
    borderRadius: 7,
    marginLeft: 3,
    marginRight: 3,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barWrap: {
    width: '100%',
    position: 'relative',
  },
  progressBarWrap: {
    height: 30,
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  progressWrapBottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '100%',
    marginTop: 20,
  },
  progressText: {
    position: 'absolute',
    top: 42,
    left: 0,
  },
  durationText: {
    position: 'absolute',
    top: 39,
    right: 0,
  },
})
