import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { Appbar, IconButton } from 'react-native-paper'
import FeatherIcon from 'react-native-vector-icons/Feather'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { useSearchCommunities, useStores, useTheme } from '../../store'
import { SCREEN_HEIGHT, STACK_HEADER_HEIGHT } from 'lib/constants'
import * as utils from '../utils/utils'
import TabBar from '../common/TabBar'
import Search from '../common/Search'
import Button from '../common/Button'
import Empty from '../common/Empty'
import Icon from '../common/Icon'
import QR from '../common/Accessories/QR'
import JoinTribe from '../common/Modals/Community/JoinCommunity'
import { setTint } from '../common/StatusBar'
import List from './List'
import { display } from 'lib/logging'

function Discover() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const isFocused = useIsFocused()

  const { chats } = useStores()
  const theme = useTheme()

  useEffect(() => {
    fetchTribes()
  }, [isFocused])

  function fetchTribes() {
    chats.getCommunities().then(() => setLoading(false))
  }

  function onRefresh() {
    setRefreshing(true)
    fetchTribes()
    setRefreshing(false)
  }

  const tribes = chats.communitiesArray
  const tribesToShow = useSearchCommunities(tribes)

  display({
    name: 'Discover',
    preview: '',
    value: { tribesToShow },
    important: true,
  })

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <SearchHeader />
      <View style={styles.content}>
        <List
          data={tribesToShow}
          loading={loading}
          refreshing={refreshing}
          onRefresh={onRefresh}
          listEmpty={<ListEmpty />}
        />
      </View>

      <TabBar />
    </View>
  )
}

export default observer(Discover)

function ListEmpty() {
  const { ui } = useStores()
  const theme = useTheme()

  return (
    <Empty h={SCREEN_HEIGHT - STACK_HEADER_HEIGHT - 60 - 60}>
      <Icon name='Rocket' size={60} />
      <Button
        color={theme.secondary}
        icon={() => <AntDesignIcon name='plus' color={theme.white} size={18} />}
        w='60%'
        onPress={() => ui.setNewTribeModal(true)}
        style={{ marginTop: 20 }}
      >
        Create Community
      </Button>
    </Empty>
  )
}

function SearchHeader() {
  const [scanning, setScanning] = useState(false)
  const theme = useTheme()
  const navigation = useNavigation()
  const { ui, chats } = useStores()
  const [joinTribe, setJoinTribe] = useState({
    visible: false,
    tribe: null,
  })

  const onTribesSearch = (txt: string) => ui.setTribesSearchTerm(txt)

  async function scan(data) {
    setTint(theme.dark ? 'dark' : 'light')
    setScanning(false)
    const j = utils.jsonFromUrl(data)

    if (j['action']) {
      const tribeParams = await chats.getTribeDetails(j.host, j.uuid)

      setJoinTribe({
        visible: true,
        tribe: tribeParams,
      })
    }
  }

  return (
    <Appbar.Header
      style={{
        ...styles.appBar,
        backgroundColor: theme.bg,
        borderBottomColor: theme.border,
      }}
    >
      <View style={{ ...styles.left }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FeatherIcon name='chevron-left' size={28} color={theme.icon} />
        </TouchableOpacity>
      </View>
      <View style={{ ...styles.middle }}>
        <Search
          placeholder='Search Communities'
          value={ui.tribesSearchTerm}
          onChangeText={onTribesSearch}
        />
      </View>
      <View style={{ ...styles.right }}>
        <IconButton
          icon='qrcode-scan'
          size={22}
          color={theme.icon}
          onPress={() => {
            setScanning(true)
            setTint('dark')
          }}
        />
      </View>

      {scanning && (
        <QR
          scannerH={SCREEN_HEIGHT - 60}
          visible={scanning}
          onCancel={() => {
            setScanning(false)
            setTint(theme.dark ? 'dark' : 'light')
          }}
          onScan={(data) => scan(data)}
          showPaster={false}
        />
      )}

      <JoinTribe
        visible={joinTribe.visible}
        tribe={joinTribe.tribe}
        close={() => {
          setJoinTribe({
            visible: false,
            tribe: null,
          })
        }}
      />
    </Appbar.Header>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 14,
  },
  appBar: {
    elevation: 0,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 6,
    width: '100%',
  },
  left: {
    width: '10%',
  },
  middle: {
    flex: 1,
    width: '80%',
  },
  right: {
    width: '10%',
  },
  searchWrap: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 14,
    paddingLeft: 14,
  },
})
