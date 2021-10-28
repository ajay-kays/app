import React, { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { observer } from 'mobx-react-lite'
import RNFetchBlob from 'rn-fetch-blob'
import { useNavigation } from '@react-navigation/native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { useStores, useTheme } from '../../store'
import Header from './Header'
import { usePicSrc } from '../utils/picSrc'
import ActionMenu from '../common/ActionMenu'
import ImageDialog from '../common/Dialogs/ImageDialog'
import TabBar from '../common/TabBar'
import Avatar from '../common/Avatar'
import AvatarEdit from '../common/Avatar/AvatarEdit'
import DialogWrap from '../common/Dialogs/DialogWrap'
import Form from '../form'
import { me } from '../form/schemas'
import Typography from '../common/Typography'
import { reportError } from 'lib/errorHelper'
import { navigate } from 'nav'

function Account() {
  const { user, contacts, meme } = useStores()
  const theme = useTheme()
  const [uploading, setUploading] = useState(false)
  const [uploadPercent, setUploadedPercent] = useState(0)
  const [userDialog, setUserDialog] = useState(false)
  const [imageDialog, setImageDialog] = useState(false)
  const [photo_url, setPhotoUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const navigation = useNavigation()

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

        await contacts.updateContact(user.myid, {
          photo_url: `https://${server.host}/public/${json.muid}`,
        })
        setUploading(false)
      })
      .catch((err) => {
        console.log(err)
        setUploading(false)
      })
  }

  async function saveUser(values) {
    setSaving(true)
    await contacts.updateContact(user.myid, {
      alias: values.alias,
    })
    setSaving(false)
    setUserDialog(false)
  }

  const items = [
    [
      {
        title: 'Account',
        icon: 'ChevronRight',
        thumbIcon: 'Settings',
        thumbBgColor: theme.primary,
        action: () => navigate('Settings'),
      },
      {
        title: 'Network',
        icon: 'ChevronRight',
        thumbIcon: 'Network',
        thumbBgColor: theme.primary,
        action: () => navigate('Network'),
      },
      {
        title: 'Security & Backup',
        icon: 'ChevronRight',
        thumbIcon: 'Lock',
        thumbBgColor: theme.primary,
        action: () => navigate('Security'),
      },
      {
        title: 'Appearance',
        icon: 'ChevronRight',
        thumbIcon: 'Moon',
        thumbBgColor: theme.primary,
        action: () => navigate('Appearance'),
      },
      {
        title: 'Contacts',
        icon: 'ChevronRight',
        thumbIcon: <AntDesignIcon name='contacts' color={theme.white} size={18} />,
        thumbBgColor: theme.primary,
        action: () => navigate('Contacts'),
      },
      {
        title: 'Support',
        icon: 'ChevronRight',
        thumbIcon: 'Mail',
        thumbBgColor: theme.primary,
        action: () => navigate('Support'),
      },
    ],
  ]

  const myid = user.myid

  const meContact = contacts.contactsArray.find((c) => c.id === myid)
  let imgURI = usePicSrc(meContact)

  if (photo_url) imgURI = photo_url

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Header onEdit={() => setUserDialog(true)} />
      <ScrollView>
        <View
          style={{
            ...styles.userInfoSection,
            borderBottomColor: theme.border,
          }}
        >
          <View
            style={{
              ...styles.userInfoContent,
            }}
          >
            <AvatarEdit
              onPress={() => setImageDialog(true)}
              uploading={uploading}
              uploadPercent={uploadPercent}
              display={false}
              size={100}
              round={50}
            >
              <Avatar size={100} photo={imgURI} round={50} />
            </AvatarEdit>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                size={20}
                fw='600'
                style={{
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                {meContact?.alias}
              </Typography>
            </View>
          </View>
        </View>
        <ActionMenu items={items} />

        <ImageDialog
          visible={imageDialog}
          onCancel={() => setImageDialog(false)}
          onPick={tookPic}
          onSnap={tookPic}
          setImageDialog={setImageDialog}
        />

        <DialogWrap title='Edit Name' visible={userDialog} onDismiss={() => setUserDialog(false)}>
          <Form
            nopad
            schema={me}
            loading={saving}
            buttonMode='text'
            buttonText='Save'
            btnW='auto'
            initialValues={{
              alias: meContact?.alias,
            }}
            onSubmit={(values) => saveUser(values)}
            action
            actionType='Dialog'
          />
        </DialogWrap>
      </ScrollView>
      <TabBar />
    </View>
  )
}

export default observer(Account)

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  userInfoSection: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    position: 'absolute',
    left: 19,
    top: 19,
  },
})
