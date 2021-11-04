import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { IconButton } from 'react-native-paper'
import RNFetchBlob from 'rn-fetch-blob'
import { useStores, useTheme } from 'store'
import Slider from '../utils/slider'
import Button from '../common/Button'
import ImageDialog from '../common/Dialogs/ImageDialog'
import Avatar from '../common/Avatar'
import Typography from '../common/Typography'

function ProfilePic({ z, show, onDone, onBack }) {
  const { contacts, user, meme } = useStores()
  const [uploading, setUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [img, setImg] = useState<any>(null) // better than any?
  const theme = useTheme()

  async function pickImage(img) {
    setImg(img)
  }

  async function finish() {
    try {
      if (img) {
        setUploading(true)
        const url = await uploadSync(img.uri)

        if (url) {
          await contacts.updateContact(user.myid, {
            photo_url: url,
          })
        }
        setUploading(false)
      }
    } catch (error) {
      await user.reportError('ProfilePic component - finish function', error)
    } finally {
      onDone()
    }
  }

  async function uploadSync(uri) {
    return new Promise((resolve, reject) => {
      const type = 'image/jpg'
      const name = 'Image.jpg'
      const server = meme.getDefaultServer()
      if (!server) {
        resolve('')
        return
      }

      uri = uri.replace('file://', '')

      RNFetchBlob.fetch(
        'POST',
        `https://${server.host}/public`,
        {
          Authorization: `Bearer ${server.token}`,
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'file',
            filename: name,
            type: type,
            data: RNFetchBlob.wrap(uri),
          },
          { name: 'name', data: name },
        ]
      )
        .uploadProgress({ interval: 250 }, (written, total) => {
          console.log('uploaded', written / total)
        })
        .then(async (resp) => {
          let json = resp.json()
          if (json.muid) {
            resolve(`https://${server.host}/public/${json.muid}`)
          }
          setUploading(false)
          return
        })
        .catch(async (err) => {
          await user.reportError('ProfilePic component - uploadSync function', err)
          setUploading(false)
          resolve('')
          return
        })
    })
  }

  return (
    <Slider
      z={z}
      show={show}
      style={{ backgroundColor: theme.bg }}
      accessibilityLabel='onboard-profile'
    >
      <IconButton
        icon='arrow-left'
        color={theme.grey}
        size={26}
        style={styles.backArrow}
        onPress={onBack}
        accessibilityLabel='onboard-profile-back'
      />
      <View style={styles.nicknameWrap} accessibilityLabel='onboard-profile-nickname-wrap'>
        <Typography size={32} textAlign='center' style={styles.nickname}>
          {user.alias}
        </Typography>
      </View>
      <View style={styles.mid} accessibilityLabel='onboard-profile-middle'>
        <Avatar size={200} photo={img && img.uri} round={100} />
        <Button
          accessibilityLabel='onboard-profile-choose-image'
          onPress={() => setDialogOpen(true)}
          style={{ ...styles.selectButton }}
          color={theme.lightGrey}
          w={200}
        >
          <Typography color={theme.black}>Select Image</Typography>
        </Button>
      </View>
      <View style={styles.buttonWrap} accessibilityLabel='onboard-profile-button-wrap'>
        <Button
          accessibilityLabel='onboard-profile-button'
          loading={uploading}
          onPress={finish}
          style={{ ...styles.button }}
          size='large'
          w={150}
        >
          <Typography color={theme.white}> {img ? 'Next' : 'Skip'}</Typography>
        </Button>
      </View>

      <ImageDialog
        visible={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onPick={pickImage}
        onSnap={pickImage}
        setImageDialog={setDialogOpen}
      />
    </Slider>
  )
}

export default observer(ProfilePic)

const styles = StyleSheet.create({
  backArrow: {
    position: 'absolute',
    left: 15,
    top: 45,
  },
  nicknameWrap: {
    position: 'absolute',
    top: 12,
  },
  nickname: {
    marginTop: 60,
    marginLeft: 50,
    marginRight: 50,
  },
  mid: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButton: {
    marginTop: 20,
  },
  buttonWrap: {
    position: 'absolute',
    bottom: 42,
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  button: {
    marginRight: '12.5%',
  },
})
