import React, { useState, useEffect } from 'react'
import { View, Text, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import ImageDialog from '../../common/Dialogs/ImageDialog'

export default function PhotoInput({ name, label, required, setValue, value, accessibilityLabel }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [takingPhoto, setTakingPhoto] = useState(false)

  function tookPic(uri) {
    // setDialogOpen(false)
    // setTakingPhoto(false)
    setValue(uri)
  }

  const imgURI = value
  const hasImgURI = imgURI ? true : false

  return (
    <View style={{ ...styles.wrap }}>
      <TouchableWithoutFeedback onPress={() => setDialogOpen(true)}>
        <View style={styles.box}>
          <Text style={styles.label}>{`${label.en}${required ? ' *' : ''}`}</Text>
        </View>
      </TouchableWithoutFeedback>

      {!hasImgURI && (
        <Icon
          name='picture'
          color='#888'
          size={25}
          style={{ position: 'absolute', right: 13, top: 17 }}
          onPress={() => setDialogOpen(true)}
        />
      )}

      {hasImgURI && (
        <Image
          source={{ uri: imgURI }}
          style={{
            width: 52,
            height: 52,
            position: 'absolute',
            right: 0,
            top: 1,
            borderRadius: 3,
          }}
        />
      )}

      <ImageDialog
        visible={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onPick={tookPic}
        onSnap={tookPic}
        setImageDialog={setDialogOpen}
      />
    </View>
  )
}

const styles = {
  wrap: {
    flex: 1,
  },
  box: {
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    marginBottom: 25,
    height: 55,
  },
  label: {
    fontSize: 15,
    color: '#666',
    top: 20,
    left: 12,
  },
}
