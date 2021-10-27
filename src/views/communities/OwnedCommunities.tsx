import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { useIsFocused } from '@react-navigation/native'
import { useCommunities, useOwnedCommunities, useStores, useTheme } from '../../store'
import Typography from '../common/Typography'
import Button from '../common/Button'
import Empty from '../common/Empty'
import List from './List'
import { SCREEN_HEIGHT, SCREEN_WIDTH, STACK_HEADER_HEIGHT } from 'lib/constants'

function OwnedCommunitiesFC() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { ui, chats } = useStores()
  const theme = useTheme()
  const isFocused = useIsFocused()

  useEffect(() => {
    fetchTribes()
  }, [ui.newTribeModal, isFocused])

  function fetchTribes() {
    chats.getTribes().then(() => {
      setLoading(false)
      setRefreshing(false)
    })
  }

  function onRefresh() {
    setRefreshing(true)
    fetchTribes()
  }

  const tribes = useCommunities()
  const tribesToShow = useOwnedCommunities(tribes)

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <View style={styles.content}>
        <List
          data={tribesToShow}
          loading={loading}
          refreshing={refreshing}
          onRefresh={onRefresh}
          listEmpty={<ListEmpty />}
        />
      </View>
    </View>
  )
}

export default observer(OwnedCommunitiesFC)

function ListEmpty() {
  const { ui } = useStores()
  const theme = useTheme()

  return (
    <Empty h={SCREEN_HEIGHT - STACK_HEADER_HEIGHT - 60 - 60 - 14} w={SCREEN_WIDTH - 100}>
      <Typography size={16} textAlign='center'>
        Become a community owner to see it listed here.
      </Typography>
      <Button
        icon={() => <AntDesignIcon name='plus' color={theme.white} size={18} />}
        w={210}
        fs={12}
        onPress={() => ui.setNewTribeModal(true)}
        style={{ marginTop: 20 }}
      >
        Create Community
      </Button>
    </Empty>
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
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingTop: 6,
    paddingBottom: 8,
  },
  headerWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    paddingLeft: 14,
  },
  emptyWrap: {},
})
