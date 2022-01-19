import React, { useState, useEffect } from 'react'
import { Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import FastImage from 'react-native-fast-image'
import styles from './styles'

type ImageSize = {
  height: number
  width: number
}

const getOriginalImageSize = async (imageUri: string): Promise<ImageSize> =>
  new Promise<ImageSize>((resolve, reject) =>
    Image.getSize(imageUri, (width: number, height: number) => resolve({ width, height }), reject)
  )

interface ItemProps {
  i: number
  item: any
}

const Item =
  (onSendGifHandler: (item: any) => void) =>
    ({ item, i }: ItemProps) => {
      const [imgAspectRatio, setImgAspectRatio] = useState(0)

      const thumb = item.images.original.url.replace(/giphy.gif/g, '100w.gif')

      useEffect(() => {
        const getImageRatio = async () => {
          const imageSize = await getOriginalImageSize(thumb)
          if (!imageSize) return
          setImgAspectRatio(
            imageSize.height > imageSize.width
              ? imageSize.height / imageSize.width
              : imageSize.width / imageSize.height
          )
        }
        getImageRatio()
      }, [thumb])

      return (
        <TouchableOpacity
          key={item.id}
          style={styles.gifWrapper}
          onPress={() => onSendGifHandler(item)}
        >
          {
            !imgAspectRatio ? <ActivityIndicator /> : <FastImage
              resizeMode='contain'
              source={{ uri: thumb }}
              style={{ ...styles.gif, aspectRatio: imgAspectRatio }}
            />
          }
        </TouchableOpacity>
      )
    }

export default Item
