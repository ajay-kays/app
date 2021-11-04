import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'
import { observer } from 'mobx-react-lite'
// import { useNavigation } from '@react-navigation/native'
import Video from 'react-native-video'
import { IconButton, TextInput } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useCommunities, useStores, useTheme } from 'store'
import { navigate } from 'nav'
import { DEFAULT_TRIBE_SERVER } from 'lib/config'
import { SCREEN_HEIGHT, STATUS_BAR_HEIGHT } from 'lib/constants'
import { setTint } from '../../StatusBar'
import Header from '../ModalHeader'
import Button from '../../Button'
import Avatar from '../../Avatar'
import Typography from '../../Typography'

const JoinTribeWrap = observer((props: any) => {
  return <>{props.visible && <JoinTribe {...props} />}</>
})

export default JoinTribeWrap

// export default function JoinTribeWrap(props) {
//   return <>{props.visible && <JoinTribe {...props} />}</>
// }

function JoinTribe(props) {
  const { visible, close, tribe } = props

  const { chats } = useStores()
  const theme = useTheme()
  const [videoVisible, setVideoVisible] = useState(false)
  const [alias, setAlias] = useState('')

  const tribes = useCommunities()
  const tribeToCheck = tribes && tribes.find((t) => t.uuid === tribe.uuid)
  let joined = true
  if (tribeToCheck) {
    joined = tribeToCheck.joined
  }

  function onJoinPress() {
    setTimeout(() => {
      setTint('dark')
      setVideoVisible(true)
    }, 500)
  }

  async function joinTribe() {
    await chats.joinTribe({
      name: tribe.name,
      group_key: tribe.group_key,
      owner_alias: tribe.owner_alias,
      owner_pubkey: tribe.owner_pubkey,
      host: tribe.host || DEFAULT_TRIBE_SERVER,
      uuid: tribe.uuid,
      img: tribe.img,
      amount: tribe.price_to_join || 0,
      is_private: tribe.private,
      ...(alias && { my_alias: alias }),
    })

    setVideoVisible(false)
    finish()
  }

  async function finish() {
    close()
    navigate('Community', { tribe: { ...tribeToCheck } })
    setTimeout(() => setTint(theme.dark ? 'dark' : 'light'), 150)
  }

  let prices: any[] = []
  if (tribe) {
    prices = [
      { label: 'Price to Join', value: tribe.price_to_join },
      { label: 'Price per Message', value: tribe.price_per_message },
      { label: 'Amount to Stake', value: tribe.escrow_amount },
    ]
  }

  const hasImg = tribe && tribe.img ? true : false

  return (
    <>
      <Modal
        visible={visible}
        animationType='slide'
        presentationStyle='fullScreen'
        onDismiss={close}
      >
        <SafeAreaView style={{ ...styles.wrap, backgroundColor: theme.bg }}>
          <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }} keyboardVerticalOffset={1}>
            <Header title='Join Community' onClose={close} />
            <ScrollView>
              {tribe && (
                <View style={{ ...styles.content }}>
                  <Avatar photo={hasImg && tribe.img} size={160} round={90} />
                  <Typography
                    size={20}
                    fw='500'
                    style={{
                      marginTop: 10,
                    }}
                  >
                    {tribe.name}
                  </Typography>
                  <Typography
                    color={theme.subtitle}
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                      maxWidth: 340,
                      textAlign: 'center',
                      marginHorizontal: 'auto',
                    }}
                  >
                    {tribe.description}
                  </Typography>
                  <View style={{ ...styles.table, borderColor: theme.border }}>
                    {prices &&
                      prices.map((p, i) => {
                        return (
                          <View
                            key={i}
                            style={{
                              ...styles.tableRow,
                              borderBottomColor: theme.border,
                              borderBottomWidth: i === prices.length - 1 ? 0 : 1,
                            }}
                          >
                            <Typography color={theme.title}>{`${p.label}`}</Typography>
                            <Typography fw='500'>{p.value || 0}</Typography>
                          </View>
                        )
                      })}
                  </View>
                  {!joined ? (
                    <>
                      <TextInput
                        autoCompleteType='off'
                        placeholder='Your name in this community'
                        onChangeText={(e) => setAlias(e)}
                        value={alias}
                        style={{
                          ...styles.input,
                          backgroundColor: theme.bg,
                          color: theme.placeholder,
                        }}
                        underlineColor={theme.border}
                      />
                      <Button
                        style={{ marginBottom: 20 }}
                        onPress={onJoinPress}
                        size='large'
                        w={240}
                      >
                        Join
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography
                        size={16}
                        color={theme.subtitle}
                        style={{
                          marginTop: 10,
                          marginBottom: 20,
                          maxWidth: 340,
                          textAlign: 'center',
                        }}
                      >
                        You already joined this community.
                      </Typography>
                      <Button w={300} onPress={finish} ph={20} style={{ marginVertically: 20 }}>
                        Go to {tribeToCheck?.name}
                      </Button>
                    </>
                  )}
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>

        {/* {finish && ( // TODO: WTF?? */}
        <MemoizedVideoView
          videoVisible={videoVisible}
          tribe={tribeToCheck}
          joinTribe={joinTribe}
          close={() => {
            setVideoVisible(false)
            setTint(theme.dark ? 'dark' : 'light')
          }}
        />
        {/* )} */}
      </Modal>
    </>
  )
}

function VideoView({ videoVisible, tribe, joinTribe, close }) {
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const network = require('../../../../assets/videos/network-nodes-blue.mp4')

  async function onJoin() {
    if (loading) return
    setLoading(true)
    await joinTribe()
    setLoading(false)
  }

  return (
    <Modal visible={videoVisible} animationType='fade' presentationStyle='fullScreen'>
      <IconButton
        icon={() => <MaterialCommunityIcon name='close' color={theme.white} size={30} />}
        onPress={close}
        style={{ ...styles.closeButton }}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: theme.black,
          height: SCREEN_HEIGHT,
        }}
      >
        <Video
          source={network}
          resizeMode='cover'
          repeat
          style={{
            height: SCREEN_HEIGHT,
          }}
        />
        {tribe && (
          <View
            style={{
              position: 'absolute',
              bottom: 100,
              right: 0,
              left: 0,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Button w={300} onPress={onJoin} loading={loading} ph={20}>
              Go to {tribe.name}
            </Button>
          </View>
        )}
      </View>
    </Modal>
  )
}

function areEqual(prev, next) {
  return prev.videoVisible === next.videoVisible
}

const MemoizedVideoView = React.memo(VideoView, areEqual)

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  table: {
    borderWidth: 1,
    borderRadius: 5,
    width: 240,
    marginTop: 25,
    marginBottom: 25,
  },
  tableRow: {
    borderBottomWidth: 1,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: 50,
    maxHeight: 50,
    minWidth: 240,
    marginBottom: 40,
  },
  closeButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 1,
    right: 0,
    zIndex: 1,
  },
})
