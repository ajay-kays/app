import React from 'react'
import {
  StyleSheet,
  View,
  Keyboard,
  InputAccessoryView as ReactInputAccessoryView,
} from 'react-native'
import { useTheme } from 'store'
import Button from '../Button'

export default function InputAccessoryView(props) {
  const { nativeID, cancelText, doneText } = props
  const theme = useTheme()

  function _cancel() {
    Keyboard.dismiss()
    if (props.cancel) {
      return props.cancel()
    }
  }

  function _done() {
    Keyboard.dismiss()
    if (props.done) {
      return props.done()
    }
  }

  return (
    <ReactInputAccessoryView nativeID={nativeID} backgroundColor={theme.bg}>
      <View style={styles.btnWrap}>
        <Button
          onPress={_cancel}
          size='small'
          style={{ ...styles.button }}
          w='70%'
          round={0}
          color={theme.bg}
        >
          {cancelText}
        </Button>
        <Button onPress={_done} size='small' style={{ ...styles.button }} w='30%' round={0}>
          {doneText}
        </Button>
      </View>
    </ReactInputAccessoryView>
  )
}

InputAccessoryView.defaultProps = {
  doneText: 'Done',
  cancelText: 'Cancel',
}

const styles = StyleSheet.create({
  btnWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {},
})
