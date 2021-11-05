import React, { useState } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native-paper'
import { useChatRow, useStores, useTheme } from '../../store'
import { SCREEN_WIDTH } from 'lib/constants'
import Typography from '../common/Typography'
import Avatar from '../common/Avatar'
import Button from '../common/Button'
import RefreshLoading from '../common/RefreshLoading'
import JoinCommunity from '../common/Modals/Community/JoinCommunity'
import { navigate } from 'nav'

function ListFC(props) {
  const { data, loading, listEmpty, refreshing, onRefresh } = props
  const theme = useTheme()

  const renderItem = ({ index, item }) => <Item {...item} />

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      {loading ? (
        <View style={{ paddingTop: 30 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item.uuid}
          renderItem={renderItem}
          // ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          refreshing={refreshing}
          onRefresh={onRefresh && onRefresh}
          refreshControl={<RefreshLoading refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  )
}

export default observer(ListFC)

function Item(props) {
  const { name, description, img, joined, uuid, owner, owner_alias, chat } = props
  const { chats } = useStores()
  const theme = useTheme()
  const [joinTribe, setJoinTribe] = useState({ visible: false, tribe: null })
  const { unseenCount, hasUnseen } = useChatRow(chat?.id ?? '')

  const onItemPress = () => navigate('Community', { tribe: { ...props } })

  async function onJoinPress() {
    const host = chats.getDefaultTribeServer().host
    const tribeParams = await chats.getTribeDetails(host, uuid)
    setJoinTribe({
      visible: true,
      tribe: tribeParams,
    })
  }

  return (
    <TouchableOpacity
      style={{
        ...styles.itemRow,
        backgroundColor: theme.main,
      }}
      activeOpacity={0.5}
      onPress={onItemPress}
    >
      <View style={styles.avatarWrap}>
        <Avatar size={60} photo={img} round={50} />
      </View>

      <View style={styles.itemContent}>
        <View style={{ ...styles.row }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typography
              size={16}
              fw='500'
              // numberOfLines={1}
              style={{ width: SCREEN_WIDTH - 180 }}
            >
              {name}
            </Typography>
            {/* {!owner && (
              <>
                <View style={{ ...styles.dot, backgroundColor: theme.text }}></View>
                <Typography size={12}>{owner_alias?.trim()}</Typography>
              </>
            )} */}
          </View>

          <View style={{ paddingRight: 4 }}>
            {!owner && (
              <>
                {joined ? (
                  <Typography size={13} color={theme.primary} ls={0.5}>
                    Joined
                  </Typography>
                ) : (
                  <Button size='small' tf='capitalize' onPress={onJoinPress}>
                    Join
                  </Button>
                )}
              </>
            )}
          </View>
        </View>
        <View style={{ ...styles.bottom }}>
          <Typography
            color={theme.subtitle}
            size={13}
            numberOfLines={1}
            style={{
              maxWidth: SCREEN_WIDTH - 175,
            }}
          >
            {description}
          </Typography>
          {hasUnseen && (
            <View style={{ ...styles.badge, backgroundColor: theme.green }}>
              <Typography color={theme.white} size={12}>
                {unseenCount}
              </Typography>
            </View>
          )}
        </View>
      </View>

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
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  itemRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 8,
    padding: 16,
  },
  itemContent: {
    flex: 1,
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 14,
    // width: 60,
    // height: 60,
    // paddingLeft: 4
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginRight: 14,
  },
})
