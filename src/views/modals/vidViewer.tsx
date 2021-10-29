import React, { useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from 'store'
import { View, StyleSheet, Dimensions, BackHandler } from 'react-native'
import { IconButton } from 'react-native-paper'
import Video from 'react-native-video'

export default function VideoViewerWrap({ params, visible }) {
  const { ui } = useStores()

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      ui.setVidViewerParams(null)
      return true
    })
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', () => false)
    }
  }, [])

  function close() {
    ui.setVidViewerParams(null)
  }

  return visible && <VideoViewer params={params} close={close} />
}

function VideoViewerFC({ params, close }) {
  const { uri } = params
  const [play, setPlay] = useState(false)

  const w = Math.round(Dimensions.get('window').width)
  const h = Math.round(Dimensions.get('window').height)

  const videoRef = useRef<Video>()

  function onEnd() {
    setPlay(false)
    videoRef.current.seek(0)
  }

  function onPlay() {
    setPlay(true)
  }

  const boxStyles = { width: w, height: h - 130, top: 80 }

  return (
    <View style={styles.wrap}>
      <IconButton icon='arrow-left' color='white' size={32} style={styles.back} onPress={close} />

      <Video
        ref={videoRef}
        source={uri}
        paused={!play}
        onEnd={onEnd}
        style={{
          position: 'absolute',
          // top: 0,
          left: 0,
          ...boxStyles,
          zIndex: 100,
        }}
      />
      <IconButton
        icon='play'
        color={play ? 'transparent' : 'white'}
        size={64}
        style={{
          ...styles.play,
          left: Math.round(w / 2) - 50,
          top: Math.round(h / 2) - 50,
        }}
        onPress={onPlay}
      />
    </View>
  )
}

const VideoViewer = observer(VideoViewerFC)

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  play: {
    position: 'absolute',
    left: 40,
    top: 40,
    zIndex: 101,
  },
  back: {
    position: 'absolute',
    left: 4,
    top: 31,
  },
})
