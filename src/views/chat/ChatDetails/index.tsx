import React, { useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { IconButton, TextInput } from 'react-native-paper'
// import Slider from '@react-native-community/slider'
import { useNavigation } from '@react-navigation/native'
import RNFetchBlob from 'rn-fetch-blob'
import moment from 'moment'
import FeatherIcon from 'react-native-vector-icons/Feather'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useStores, useTheme } from '../../../store'
import { constants } from 'lib/constants'
import { useChatPicSrc, usePicSrc, createChatPic } from '../../utils/picSrc'
import EE, { LEFT_GROUP } from 'lib/ee'
import BackHeader from '../../common/BackHeader'
import GroupSettings from 'views/common/Dialogs/GroupSettings'
import ImageDialog from '../../common/Dialogs/ImageDialog'
import Avatar from '../../common/Avatar'
import AvatarEdit from '../../common/Avatar/AvatarEdit'
import Typography from '../../common/Typography'
import InputAccessoryView from '../../common/Accessories/InputAccessoryView'
import { reportError } from 'lib/errorHelper'
import { Contact } from 'store/contacts-store'

export default function ChatDetails({ route }) {
  const { ui, chats, user, contacts, meme } = useStores()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [groupSettingsDialog, setGroupSettingsDialog] = useState(false)
  const [imageDialog, setImageDialog] = useState(false)
  const [loadingTribe, setLoadingTribe] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadPercent, setUploadedPercent] = useState(0)
  const navigation = useNavigation()
  const nativeID = 'alias'

  const group = route.params.group
  const [photo_url, setPhotoUrl] = useState(group.my_photo_url || '')
  const [alias, setAlias] = useState((group && group['my_alias']) || '')
  function updateAlias() {
    if (!(group && group.id)) return
    if (alias !== group['my_alias']) {
      chats.updateMyInfoInChat(group.id, alias, photo_url)
    }
  }

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
          setPhotoUrl(`https://${server.host}/public/${json.muid}`)
        }

        chats.updateMyInfoInChat(group.id, alias, `https://${server.host}/public/${json.muid}`)
        setUploading(false)
      })
      .catch((err) => {
        setUploading(false)
      })
  }

  let initppm = chats.pricesPerMinute[group.id]
  if (!(initppm || initppm === 0)) initppm = group.pricePerMinute || 5
  const [ppm, setPpm] = useState(initppm)

  const uri = useChatPicSrc(group)
  const hasGroup = group ? true : false
  const hasImg = uri ? true : false

  const isTribe = group && group.type === constants.chat_types.tribe
  const isTribeAdmin = isTribe && group.owner_pubkey === user.publicKey

  function fuzzyIndexOf(arr, n) {
    let smallestDiff = Infinity
    let index = -1
    arr.forEach((m, i) => {
      const diff = Math.abs(m - n)
      if (diff < smallestDiff) {
        smallestDiff = diff
        index = i
      }
    })
    return index
  }

  const ppms = [0, 3, 5, 10, 20, 50, 100]
  function chooseSatsPerMinute(n) {
    if (!group.id) return
    const price = ppms[n] || 0
    chats.setPricePerMinute(group.id, price)
  }
  function satsPerMinuteChanged(n) {
    setPpm(ppms[n] || 0)
  }
  let sliderValue = fuzzyIndexOf(ppms, ppm)
  if (sliderValue < 0) sliderValue = 2

  const showValueSlider = isTribe && !isTribeAdmin && group && group.feed_url ? true : false

  async function exitGroup() {
    setLoading(true)
    await chats.exitGroup(group.id)
    setLoading(false)
    EE.emit(LEFT_GROUP)
  }

  function onExitGroup() {
    setGroupSettingsDialog(false)
    if (!loading) exitGroup()
  }

  function onShareGroup() {
    setGroupSettingsDialog(false)

    setTimeout(() => {
      ui.setShareTribeUUID(group.uuid)
    }, 500)
  }

  return useObserver(() => {
    const meContact = contacts.contactsArray.find((c) => c.id === user.myid) as Contact
    let imgURI = usePicSrc(meContact)

    let myPhoto = group.my_photo_url || imgURI

    if (photo_url) myPhoto = photo_url

    return (
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <BackHeader
          title='Details'
          navigate={() => navigation.goBack()}
          border={true}
          action={<DetailsAction chat={group} />}
        />

        <View style={styles.content}>
          {hasGroup && (
            <View style={styles.groupInfo}>
              <View style={styles.groupInfoLeft}>
                {group && <Avatar size={50} aliasSize={18} big alias={group.name} photo={uri} />}
                <View style={styles.groupInfoText}>
                  <Typography size={16} style={{ marginBottom: 4 }}>
                    {group.name}
                  </Typography>
                  <Typography
                    color={theme.title}
                    size={12}
                    style={{ marginBottom: 4 }}
                  >{`Created on ${moment(group.created_at).format('ll')}`}</Typography>
                  {Boolean(group.price_per_message !== null || group.escrow_amount !== null) && (
                    <Typography
                      size={12}
                      color={theme.subtitle}
                    >{`Price per message: ${group.price_per_message}, Amount to stake: ${group.escrow_amount}`}</Typography>
                  )}
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setGroupSettingsDialog(true)}
                style={{
                  marginLeft: 0,
                  marginRight: 0,
                  position: 'absolute',
                  right: 8,
                }}
              >
                <MaterialCommunityIcon name='dots-vertical' size={25} color={theme.icon} />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ ...styles.infoWrap }}>
            <Typography size={16}>Alias</Typography>
            <View style={{ position: 'relative' }}>
              <TextInput
                inputAccessoryViewID={nativeID}
                placeholder='Alias'
                value={alias}
                onChangeText={setAlias}
                style={{ ...styles.input, backgroundColor: theme.bg }}
                underlineColor={theme.border}
              />
              {group && (
                <View style={{ ...styles.infoImg }}>
                  <AvatarEdit
                    onPress={() => setImageDialog(true)}
                    uploading={uploading}
                    uploadPercent={uploadPercent}
                    display={true}
                    size={45}
                    top='27%'
                  >
                    <Avatar size={45} aliasSize={18} big alias={group.my_alias} photo={myPhoto} />
                  </AvatarEdit>
                </View>
              )}
            </View>

            <InputAccessoryView nativeID={nativeID} done={updateAlias} />
          </View>

          {/* {showValueSlider && (
            <View style={styles.slideWrap}>
              <View style={styles.slideText}>
                <Text style={{ ...styles.slideLabel, color: theme.subtitle }}>
                  Podcast: sats per minute
                </Text>
                <Text style={{ ...styles.slideValue, color: theme.subtitle }}>{ppm}</Text>
              </View>
              <Slider
                minimumValue={0}
                maximumValue={6}
                value={sliderValue}
                step={1}
                minimumTrackTintColor={theme.primary}
                maximumTrackTintColor={theme.primary}
                thumbTintColor={theme.primary}
                onSlidingComplete={chooseSatsPerMinute}
                onValueChange={satsPerMinuteChanged}
                style={{ width: '90%' }}
              />
            </View>
          )} */}
        </View>
        <GroupSettings
          visible={groupSettingsDialog}
          owner={isTribeAdmin}
          onCancel={() => setGroupSettingsDialog(false)}
          shareGroup={onShareGroup}
          exitGroup={onExitGroup}
        />
        <ImageDialog
          visible={imageDialog}
          onCancel={() => setImageDialog(false)}
          onPick={tookPic}
          onSnap={tookPic}
          setImageDialog={setImageDialog}
        />
      </View>
    )
  })
}

function DetailsAction({ chat }) {
  const { chats } = useStores()
  const theme = useTheme()

  return useObserver(() => {
    const theChat = chats.chatsArray.find((c) => c.id === chat.id)
    const isMuted = (theChat && theChat.is_muted) || false

    async function muteChat() {
      chats.muteChat(chat.id, isMuted ? false : true)
    }

    return (
      <>
        {chat && (
          <IconButton
            icon={() => (
              <FeatherIcon name={isMuted ? 'bell-off' : 'bell'} size={22} color={theme.icon} />
            )}
            onPress={muteChat}
          />
        )}
      </>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 40,
    paddingTop: 40,
  },
  groupInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  groupInfoLeft: {
    paddingLeft: 16,
    display: 'flex',
    flexDirection: 'row',
  },
  groupInfoText: {
    display: 'flex',
    height: 54,
    justifyContent: 'center',
    marginLeft: 14,
    maxWidth: '77%',
  },
  infoWrap: {
    display: 'flex',
    width: '100%',
    paddingTop: 30,
    paddingLeft: 18,
    paddingRight: 18,
  },
  input: {
    height: 50,
    paddingRight: 60,
    textAlign: 'auto',
  },
  infoImg: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scroller: {
    width: '100%',
    position: 'relative',
  },
  slideWrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 62,
    marginTop: 20,
  },
  slideText: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
  },
  slideLabel: {
    fontSize: 13,
  },
  slideValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
})
