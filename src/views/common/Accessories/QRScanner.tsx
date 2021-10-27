import React from 'react'
import { StyleSheet, View } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'lib/constants'

export default function QRScanner(props) {
  const { handleBarCodeScanned, height, scanned, smaller } = props
  const less = smaller ? 310 : 100
  let w = SCREEN_WIDTH
  let h = height || SCREEN_HEIGHT - less
  if (w === 0) w = 280

  function onSuccess(e) {
    if (!scanned) {
      handleBarCodeScanned(e.data)
    }
  }

  return (
    <View style={{ ...styles.scannerWrap, maxHeight: h }}>
      <QRCodeScanner
        onRead={onSuccess}
        cameraType='back'
        cameraProps={{
          flashMode: RNCamera.Constants.FlashMode.off,
        }}
      />
      <Outliner size={w - 80} top={h / 2 - (w / 2 - 40)} />
    </View>
  )
}

const outlines = [
  { top: 0, left: 0, height: 50, width: 3 },
  { top: 0, left: 0, height: 3, width: 50 },
  { top: 0, right: 0, height: 50, width: 3 },
  { top: 0, right: 0, height: 3, width: 50 },
  { bottom: 0, right: 0, height: 50, width: 3 },
  { bottom: 0, right: 0, height: 3, width: 50 },
  { bottom: 0, left: 0, height: 50, width: 3 },
  { bottom: 0, left: 0, height: 3, width: 50 },
]

function Outliner({ size, top }) {
  return (
    <View style={{ ...styles.outlineWrap, width: size, height: size, top }}>
      {outlines.map((o, i) => {
        return <View key={i} style={{ position: 'absolute', backgroundColor: 'white', ...o }} />
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  scannerWrap: {
    flex: 1,
    backgroundColor: 'black',
    maxHeight: '100%',
    maxWidth: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  outlineWrap: {
    left: 40,
    position: 'absolute',
  },
})
