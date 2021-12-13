import React, { useEffect, useState, memo } from 'react'
import { StyleSheet, View, ScrollView, Modal, Animated, Dimensions } from 'react-native'
import { observer } from 'mobx-react-lite'
import RNFetchBlob from 'rn-fetch-blob'
import { useStores, useTheme } from 'store'
import { SCREEN_WIDTH } from 'lib/constants'
import { DEFAULT_TRIBE_SERVER } from 'lib/config'
import ModalHeader from '../ModalHeader'
import Form from '../../../form'
import * as schemas from '../../../form/schemas'
import Avatar from '../../Avatar'
import Button from '../../Button'
import ImageDialog from '../../Dialogs/ImageDialog'
import AvatarEdit from '../../Avatar/AvatarEdit'
// import AddMembers from '../../../Tribes/Members/AddMembers'
import TribeTags from 'views/communities/Community/TribeTags'
import { reportError } from 'lib/errorHelper'

function AddTribe() {
  const { ui, chats } = useStores()
  const [loading, setLoading] = useState(false)
  const [next, setNext] = useState(1)
  const [form, setForm] = useState<any>(null)
  const [photo, setPhoto] = useState(null)
  const theme = useTheme()
  const appearAnim = new Animated.Value(SCREEN_WIDTH)

  useEffect(() => {
    Animated.timing(appearAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  })

  async function finishForm(v) {
    setLoading(true)
    setNext(2)
    setForm(v)
    setLoading(false)
  }

  function finishPhoto(v) {
    setPhoto(v)
    setNext(3)
  }

  async function finish(values) {
    const tags = values
    setLoading(true)

    const newTribe = {
      ...form,
      tags,
      img: photo,
    }

    setLoading(false)
    close()
    await chats.createTribe(newTribe)

    chats.getCommunities()
  }

  function close() {
    ui.setNewTribeModal(false)
    setTimeout(() => {
      setNext(1)
    }, 300)
  }

  function getTitle() {
    if (next === 1) {
      return 'Add Community'
    } else if (next === 2) {
      return 'Add Photo'
    } else if (next === 3) {
      return 'Add Community Topics'
    }
  }

  return (
    <Modal
      visible={ui.newTribeModal}
      animationType='slide'
      presentationStyle='pageSheet'
      onDismiss={close}
    >
      <ModalHeader title={getTitle()} onClose={close} />
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        {next === 1 ? (
          <ScrollView style={styles.scroller} contentContainerStyle={styles.container}>
            <Form
              schema={schemas.tribe}
              loading={loading}
              buttonAccessibilityLabel='add-tribe-form-button'
              buttonText='Next'
              onSubmit={finishForm}
              initialValues={{
                feed_url: '',
                app_url: '',
                escrow_amount: 10,
                escrow_time: 12,
                price_to_join: 0,
                price_per_message: 0,
                host: DEFAULT_TRIBE_SERVER,
                name: '',
                description: '',
                img: '',
                tags: [],
                unlisted: false,
                is_private: false,
              }}
            />
          </ScrollView>
        ) : next === 2 ? (
          <Animated.View
            style={{
              transform: [
                {
                  translateX: appearAnim,
                },
              ],
            }}
          >
            <AddPhoto finish={finishPhoto} />

            {/* <AddMembers initialMemberIds={[]} loading={loading} finish={finish} /> */}
          </Animated.View>
        ) : (
          <Animated.View
            style={{
              transform: [
                {
                  translateX: appearAnim,
                },
              ],
            }}
          >
            <View
              style={{
                // marginBottom: 60,
                paddingHorizontal: 45,
              }}
            >
              <TribeTags
                tags={[]}
                finish={finish}
                saveAction={false}
                saveText='Finish'
                btnMode='contained'
                btnW='60%'
              />
            </View>
          </Animated.View>
        )}
      </View>
    </Modal>
  )
}

export default observer(AddTribe)

const AddPhoto = ({ finish }) => {
  const [imageDialog, setImageDialog] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [uploadPercent, setUploadedPercent] = useState(0)
  const [photo, setPhoto] = useState('')
  const { chats, meme } = useStores()
  const theme = useTheme()

  async function tookPic(img) {
    setUploading(true)
    try {
      await upload(img.uri)
    } catch (e) {
      setUploading(false)
      reportError(e)
    }
  }

  async function upload(uri) {
    const type = 'image/jpg'
    const name = 'Image.jpg'
    const server = meme.getDefaultServer()
    if (!server) return

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
        setUploadedPercent(Math.round((written / total) * 100))
      })
      .then(async (resp) => {
        let json = resp.json()

        if (json.muid) {
          setPhoto(`https://${server.host}/public/${json.muid}`)
          setShowNext(true)
          setUploading(false)
        }
      })
      .catch((err) => {
        console.log(err)
        setUploading(false)
      })
  }

  return (
    <View
      style={{
        marginBottom: 60,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View>
          <AvatarEdit
            uploading={uploading}
            uploadPercent={uploadPercent}
            display={true}
            onPress={() => setImageDialog(true)}
            size={250}
            round={200}
            top='42%'
            percentSize={20}
          >
            <Avatar size={250} round={200} photo={photo} />
          </AvatarEdit>
        </View>

        <Button
          w='60%'
          onPress={() => (showNext ? finish(photo) : setImageDialog(true))}
          style={{ marginTop: 20 }}
          size='large'
        >
          {showNext ? 'Next' : 'Select Photo'}
        </Button>
        <Button
          w={100}
          color={theme.special}
          onPress={() => finish(photo)}
          style={{ marginTop: 20 }}
          size='large'
        >
          Skip
        </Button>
        <ImageDialog
          visible={imageDialog}
          onCancel={() => setImageDialog(false)}
          onPick={tookPic}
          onSnap={tookPic}
          setImageDialog={setImageDialog}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
  },
  scroller: {
    width: '100%',
    display: 'flex',
    flex: 1,
  },
  container: {
    width: '100%',
  },
})
