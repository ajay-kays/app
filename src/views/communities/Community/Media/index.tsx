import React, { useState, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useOwnerMedia, useMsgs, useStores, useTheme } from 'store'
import { SCREEN_WIDTH } from 'lib/constants'
import MediaItem from './MediaItem'
import { Icon, Empty, Typography } from 'views/common'
import { setTint } from 'views/common/StatusBar'
import PhotoViewer from 'views/common/Modals/Media/PhotoViewer'
import { ActivityIndicator } from 'react-native-paper'

const Media = observer(({ tribe }: any) => {
  const { msg, ui, user } = useStores()
  const [mediaModal, setMediaModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const theme = useTheme()

  function onMediaPress(id) {
    setSelectedMedia(id)
    setMediaModal(true)
    setTimeout(() => {
      setTint('dark')
    }, 300)
  }

  // console.log(msg.mediaMessages)
  // let msgs
  // if (tribe && tribe.chat && tribe.chat.id) {
  //   msgs = msg.mediaMessages[tribe.chat.id]
  // } else {
  //   msgs = []
  // }

  const msgs = tribe.chat ? useMsgs(tribe.chat, 2500) || [] : []
  const media = useOwnerMedia(msgs, tribe, 6, user.myid)

  const loading = ui.chatMsgsLoading === tribe?.chat?.id

  return (
    <>
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <View style={{ ...styles.mediaContainer }}>
          {media.length > 0 ? (
            media.map((m, index) => {
              return (
                <MediaItem
                  key={m.id}
                  // id={m.id} // cuz specified already in m - "specified more than once" error
                  index={index}
                  {...m}
                  chat={tribe.chat}
                  onMediaPress={onMediaPress}
                />
              )
            })
          ) : loading ? (
            <View style={{ ...styles.empty }}>
              <View style={styles.spinWrap}>
                <ActivityIndicator animating={true} color={theme.icon} />
              </View>
              <Typography
                size={14}
                fw='500'
                color={theme.subtitle}
                style={{ marginTop: 10, marginBottom: 10 }}
              >
                Checking for media
              </Typography>
            </View>
          ) : (
            <Empty h={200}>
              {tribe.owner ? (
                <View style={{ ...styles.empty }}>
                  <MaterialIcon name='animation-play' color={theme.iconPrimary} size={50} />
                  <Typography size={17} fw='500' style={{ marginTop: 10, marginBottom: 10 }}>
                    Media Feed
                  </Typography>
                  <Typography size={14} color={theme.subtitle}>
                    When you share photos and videos in your community's chat, they will appear
                    here.
                  </Typography>
                </View>
              ) : (
                <View style={{ ...styles.empty }}>
                  {!tribe.joined ? <Icon name='Join' size={70} /> : <Icon name='Empty' size={70} />}
                  <Typography
                    size={14}
                    fw='500'
                    color={theme.subtitle}
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    {!tribe.joined
                      ? `Join ${tribe.name} to receive posts from ${tribe.owner_alias?.trim()}`
                      : `${tribe.owner_alias?.trim()} has not shared photos or videos since you've joined`}
                  </Typography>
                </View>
              )}
            </Empty>
          )}
        </View>
        <PhotoViewer
          visible={mediaModal}
          close={() => {
            setMediaModal(false)
            setTint(theme.dark ? 'dark' : 'light')
          }}
          photos={media && media.filter((m) => m.id === selectedMedia)}
          // initialIndex={media && media.findIndex(m => m.id === selectedMedia)}
          initialIndex={0}
          chat={tribe.chat}
        />
      </View>
    </>
  )
})

function Viewer(props) {
  return useMemo(() => <PhotoViewer {...props} />, [props.visible])
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: SCREEN_WIDTH,
    paddingVertical: 1,
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    paddingHorizontal: 14,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  spinWrap: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default React.memo(Media)
