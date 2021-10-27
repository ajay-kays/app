import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import RNFetchBlob from 'rn-fetch-blob'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { useStores, useTheme } from 'store'
import { Avatar, Button, Typography } from 'views/common'
import ImageDialog from '../../common/Dialogs/ImageDialog'
import PhotoModal from '../../common/Modals/Media/Photo'
import JoinCommunity from '../../common/Modals/Community/JoinCommunity'
import AvatarEdit from '../../common/Avatar/AvatarEdit'
import { setTint } from '../../common/StatusBar'
import { reportError } from 'lib/errorHelper'
import { navigate } from 'nav'

const Intro = ({ tribe }) => {
  const { chats, meme } = useStores()
  const theme = useTheme()
  const [imageDialog, setImageDialog] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadPercent, setUploadedPercent] = useState(0)
  const [photoModal, setPhotoModal] = useState(false)
  const [tribePhoto, setTribePhoto] = useState('')

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
          setTribePhoto(`https://${server.host}/public/${json.muid}`)

          await chats.editTribe({
            ...tribe,
            id: tribe.chat.id,
          })
        }

        setUploading(false)
      })
      .catch((err) => {
        console.log(err)
        setUploading(false)
      })
  }

  function onTribeMembersPress() {
    navigate('TribeMembers', { tribe })
  }

  if (tribePhoto) tribe.img = tribePhoto

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <View style={{ ...styles.header }}>
        <View style={{ ...styles.avatarWrap }}>
          <AvatarEdit
            onPress={() => {
              if (tribe.owner) {
                setImageDialog(true)
              } else {
                if (tribe.img) {
                  setPhotoModal(true)
                  setTimeout(() => {
                    setTint('dark')
                  }, 300)
                }
              }
            }}
            uploading={uploading}
            uploadPercent={uploadPercent}
            display={!tribe.owner}
            size={80}
            round={50}
            top='40%'
          >
            <Avatar photo={tribe.img} size={80} round={50} />
          </AvatarEdit>
        </View>

        <View style={styles.headerContent}>
          <View
            style={{
              ...styles.row,
              flex: 1,
              flexWrap: 'wrap',
            }}
          >
            <Typography size={22} fw='600' numberOfLines={1}>
              {tribe.name}
            </Typography>
            {!tribe.owner && (
              <>
                <View style={{ ...styles.dot, backgroundColor: theme.text }}></View>
                <Typography size={14} fw='500' color={theme.subtitle} numberOfLines={1}>
                  {tribe.owner_alias?.trim()}
                </Typography>
              </>
            )}
          </View>

          <View
            style={{
              ...styles.row,
              marginTop: 6,
              marginBottom: 14,
            }}
          >
            <View
              style={{
                ...styles.row,
              }}
            >
              <MaterialIcon name='public' size={18} color={theme.grey} />
              <Typography size={14} style={{ paddingLeft: 4 }}>
                {tribe.private ? 'Private Community' : 'Public Community'}
              </Typography>
              <View style={{ ...styles.dot, backgroundColor: theme.text }}></View>
            </View>

            {/* {tribe.owner ? ( */}
            <TouchableOpacity
              style={{
                ...styles.row,
                flex: 1,
              }}
              onPress={onTribeMembersPress}
            >
              <Typography size={14} fw='600' numberOfLines={1}>
                {tribe.member_count}{' '}
              </Typography>
              <Typography size={14} numberOfLines={1} style={{ flexShrink: 1 }}>
                members
              </Typography>
            </TouchableOpacity>
            {/* ) : ( */}
            {/* <>
                  <Typography size={14} fw='600'>
                    {tribe.member_count}{' '}
                  </Typography>
                  <Typography size={14}>members</Typography>
                </> */}
            {/* )} */}
          </View>

          <TribeActions tribe={tribe} />
        </View>
      </View>
      <ImageDialog
        visible={imageDialog}
        onCancel={() => setImageDialog(false)}
        onPick={tookPic}
        onSnap={tookPic}
        setImageDialog={setImageDialog}
      />
      <PhotoModal
        visible={photoModal}
        close={() => {
          setPhotoModal(false)
          setTint(theme.dark ? 'dark' : 'light')
        }}
        photo={tribe.img}
      />
    </View>
  )
}

export default observer(Intro)

const TribeActionsFC = ({ tribe }) => {
  const { chats, msg, ui } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [joinTribe, setJoinTribe] = useState({
    visible: false,
    tribe: null,
  })

  async function onJoinPress() {
    const host = chats.getDefaultTribeServer().host
    const tribeParams = await chats.getTribeDetails(host, tribe.uuid)

    setJoinTribe({
      visible: true,
      tribe: tribeParams,
    })
  }

  async function onChatPress() {
    setLoading(true)
    try {
      msg.seeChat(tribe.chat.id) // Ping relay to read message - CD removed await here
      // Only call getMessages if this tribe doesn't already have messages
      const howManyMsgs = msg.msgsForChatroom(tribe.chat.id)
      if (!howManyMsgs || howManyMsgs.length === 0) {
        await msg.getMessages()
      }

      navigate('Chat', { ...tribe.chat })
    } catch (e) {
      navigate('Chat', { ...tribe.chat })
      setLoading(false)
      reportError(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <>
        {!tribe.owner ? (
          <>
            {tribe.joined ? (
              <View style={{ ...styles.headerActions }}>
                <Button
                  icon={() => <Ionicon name='chatbubbles-outline' color={theme.white} size={20} />}
                  onPress={onChatPress}
                  loading={loading}
                  w='60%'
                >
                  Chat
                </Button>
              </View>
            ) : (
              <Button color={theme.primary} onPress={onJoinPress} w='35%'>
                Join
              </Button>
            )}
          </>
        ) : (
          <Button
            icon={() => <Ionicon name='chatbubbles-outline' color={theme.white} size={20} />}
            onPress={onChatPress}
            loading={loading}
            w='60%'
          >
            Chat
          </Button>
        )}
      </>
      <JoinCommunity
        visible={joinTribe.visible}
        tribe={joinTribe.tribe}
        close={() => {
          setJoinTribe({
            visible: false,
            tribe: null,
          })
        }}
      />
    </>
  )
}

const TribeActions = observer(TribeActionsFC)

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingRight: 14,
    paddingLeft: 14,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  headerContent: {
    display: 'flex',
    width: '80%',
    paddingLeft: 25,
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    width: '20%',
    // justifyContent: 'center'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  headerActions: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
})
