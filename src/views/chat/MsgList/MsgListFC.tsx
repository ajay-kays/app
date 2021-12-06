import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from 'react-native'
import { constants } from 'lib/constants'
import { ListItem } from './ListItem'
import EE, { SHOW_REFRESHER } from 'lib/ee'
import { useTheme } from 'store'

const group = constants.chat_types.group
const tribe = constants.chat_types.tribe

export const MsgListFC = ({
  msgsLength,
  msgs,
  chat,
  onDelete,
  myPubkey,
  myAlias,
  onApproveOrDenyMember,
  onDeleteChat,
  onLoadMoreMsgs,
  onBoostMsg,
  myid,
}) => {
  const scrollViewRef = useRef<VirtualizedList<any> | null>(null) // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065#issuecomment-446425911
  async function onEndReached() {
    EE.emit(SHOW_REFRESHER)
    console.log('onEndReached - calling onLoadMoreMsgs')
    onLoadMoreMsgs()
  }

  // Keyboard logic
  useEffect(() => {
    const ref = setTimeout(() => {
      if (scrollViewRef && scrollViewRef.current && msgs && msgs.length) {
        scrollViewRef.current.scrollToOffset({ offset: 0 })
      }
    }, 500)
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      if (scrollViewRef && scrollViewRef.current && msgs && msgs.length) {
        scrollViewRef.current.scrollToOffset({ offset: 0 })
      }
    })
    return () => {
      clearTimeout(ref)
      showSubscription.remove()
      scrollViewRef.current = null
    }
  }, [msgs, msgsLength])

  if (chat.status === constants.chat_statuses.pending) {
    return (
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <Text
          style={{
            marginTop: 27,
            color: 'orange', // theme.subtitle
          }}
        >
          Waiting for admin approval
        </Text>
      </View>
    )
  }

  const windowWidth = Math.round(Dimensions.get('window').width)

  const isGroup = chat.type === group
  const isTribe = chat.type === tribe
  const initialNumToRender = 20
  return (
    <>
      <Refresher />
      <VirtualizedList
        accessibilityLabel='message-list'
        inverted
        style={{ zIndex: 100 }}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        windowSize={5}
        ref={scrollViewRef}
        data={msgs}
        initialNumToRender={initialNumToRender}
        initialScrollIndex={0}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        viewabilityConfig={{
          waitForInteraction: false,
          viewAreaCoveragePercentThreshold: 20,
        }}
        renderItem={({ item }) => {
          return (
            <ListItem
              key={item.id}
              windowWidth={windowWidth}
              m={item}
              chat={chat}
              myid={myid}
              isGroup={isGroup}
              isTribe={isTribe}
              onDelete={onDelete}
              myPubkey={myPubkey}
              myAlias={myAlias}
              onApproveOrDenyMember={onApproveOrDenyMember}
              onDeleteChat={onDeleteChat}
              onBoostMsg={onBoostMsg}
            />
          )
        }}
        keyExtractor={(item: any) => item.id + ''}
        getItemCount={() => msgs?.length || 0}
        getItem={(data, index) => data[index]}
        ListHeaderComponent={<View style={{ height: 13 }} />}
      />
    </>
  )
}

function Refresher() {
  const theme = useTheme()
  const [show, setShow] = useState(false)
  useEffect(() => {
    function doShow() {
      setShow(true)
      setTimeout(() => {
        setShow(false)
      }, 1000)
    }
    EE.on(SHOW_REFRESHER, doShow)
    return () => {
      EE.removeListener(SHOW_REFRESHER, doShow)
    }
  }, [])
  if (!show) return <></>
  return (
    <View style={{ ...styles.refreshingWrap, height: show ? 60 : 0 }}>
      <ActivityIndicator animating={true} color={theme.icon} size={25} />
    </View>
  )
}

const styles = StyleSheet.create({
  dateLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    height: 22,
    width: '100%',
    marginTop: 30,
  },
  dateString: {
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 15,
  },
  refreshingWrap: {
    position: 'absolute',
    zIndex: 102,
    top: 55,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
})
