import React from 'react'
import { Portal, Button, Dialog } from 'react-native-paper'
import * as ImagePicker from 'react-native-image-picker'
import { useTheme } from 'store'

export default function ImgSrcDialog({ open, onClose, onPick, onChooseCam }) {
  const theme = useTheme()

  async function pickImage() {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (result) => {
        if (!result.didCancel) {
          onPick(result)
        } else {
          onClose()
        }
      }
    )
  }

  return (
    <Portal>
      <Dialog visible={open} style={{ bottom: 10 }} onDismiss={() => onClose()}>
        <Dialog.Title style={{ color: theme.text }}>Choose Image Source</Dialog.Title>
        <Dialog.Actions style={{ justifyContent: 'space-between' }}>
          <Button icon='camera' onPress={() => onChooseCam()}>
            Camera
          </Button>
          <Button icon='image' onPress={() => pickImage()}>
            Photo Library
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}
