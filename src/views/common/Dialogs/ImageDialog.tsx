import React, { useState } from 'react'
import * as ImagePicker from 'react-native-image-picker'
import ActionSheet from '../ActionSheet'
import Camera from '../Accessories/Camera'

export default function ImageDialog({ visible, onCancel, onSnap, onPick, setImageDialog }) {
  const [cameraOpen, setCameraOpen] = useState(false)

  async function pickImage() {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (result) => {
        setImageDialog(false)
        if (!result.didCancel) {
          onPick(result)
        } else {
          onCancel()
        }
      }
    )
  }

  const items = [
    {
      id: 1,
      label: 'Camera',
      onPress: () => {
        setImageDialog(false)
        setTimeout(() => {
          setCameraOpen(true)
        }, 400)
      },
    },
    {
      id: 2,
      label: 'Photo Library',
      onPress: () => {
        pickImage()
      },
    },
  ]

  function handleOnSnap(result) {
    onSnap(result)
    setCameraOpen(false)
  }

  return (
    <>
      <ActionSheet visible={visible} items={items} onCancel={onCancel} />
      <Camera visible={cameraOpen} onSnap={handleOnSnap} onCancel={() => setCameraOpen(false)} />
    </>
  )
}
