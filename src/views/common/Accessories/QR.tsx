import React, { useState } from 'react'
import { StyleSheet, View, Modal } from 'react-native'
import { TextInput } from 'react-native-paper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTheme } from '../../../store'
import { SCREEN_HEIGHT } from 'lib/constants'
import ModalHeader from '../Modals/ModalHeader'
import QRScanner from './QRScanner'
import Button from '../Button'

export default function QR({
  visible,
  onCancel,
  onScan,
  showPaster,
  inputPlaceholder,
  isLoading = false,
  isLoopout = false,
  confirm,
  scannerH = SCREEN_HEIGHT - 300,
}) {
  const theme = useTheme()
  const [scanned, setScanned] = useState(false)
  const [text, setText] = useState('')

  function handleBarCodeScanned(data) {
    setScanned(true)

    if (showPaster) {
      setScannedInput(data)
    } else {
      onScan(data)
    }
  }

  function setScannedInput(data) {
    if (isLoopout) {
      if (data.startsWith('bitcoin:')) {
        const arr = data.split(':')
        if (arr.length > 1) setText(arr[1])
      } else {
        setText(data)
      }
      return
    } else {
      setText(data)
    }
    // if (data.length === 66)
  }

  const h = SCREEN_HEIGHT - 60
  return (
    <Modal visible={visible} animationType='slide' presentationStyle='pageSheet'>
      <View style={{ ...styles.wrap, height: h, backgroundColor: theme.bg }}>
        <ModalHeader title='Scan QR Code' onClose={onCancel} />
        <KeyboardAwareScrollView
          extraScrollHeight={120} // 70 + 50
          contentContainerStyle={{ ...styles.content }}
          scrollEnabled={false}
        >
          <QRScanner
            smaller
            height={scannerH}
            scanned={scanned ? true : false}
            handleBarCodeScanned={handleBarCodeScanned}
          />
          {showPaster && (
            <>
              <View style={{ ...styles.inputWrap, backgroundColor: theme.bg }}>
                <TextInput
                  placeholder={inputPlaceholder}
                  value={text}
                  onChangeText={(e) => setText(e)}
                  style={{ ...styles.input, backgroundColor: theme.bg }}
                  underlineColor={theme.border}
                  selectionColor={theme.primary}
                  theme={{ colors: { primary: theme.border } }}
                />
              </View>
              <View
                style={{
                  ...styles.buttonWrap,
                  backgroundColor: theme.bg,
                }}
              >
                {text.length > 0 && (
                  <Button
                    w={125}
                    onPress={() => confirm(text)}
                    disabled={!text || isLoading}
                    loading={isLoading}
                  >
                    CONFIRM
                  </Button>
                )}
              </View>
            </>
          )}
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  )
}

QR.defaultProps = {
  inputPlaceholder: 'Enter Address',
  onScan: () => {},
  confirm: () => {},
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
  },
  inputWrap: {
    paddingHorizontal: 30,
  },
  input: {
    height: 70,
    textAlign: 'auto',
  },
  buttonWrap: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: 50,
    paddingTop: 20,
  },
})
