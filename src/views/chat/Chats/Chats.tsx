import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react-lite'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useStores, useTheme } from 'store'
import ChatList from '../ChatList'
import { Button, Divider, Header, Search, TabBar } from 'views/common'
import { navigate } from 'nav'

function Chats() {
  const { ui } = useStores()
  const theme = useTheme()

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }} accessibilityLabel='dashboard'>
      <Header />
      <View style={{ ...styles.searchWrap }}>
        <Search
          placeholder='Search'
          value={ui.searchTerm}
          onChangeText={(txt) => {
            ui.setSearchTerm(txt)
          }}
          style={{ width: '100%' }}
        />
      </View>
      <ChatList listHeader={<ListHeader />} />
      <TabBar />
    </View>
  )
}

export default observer(Chats)

function ListHeader() {
  const { ui } = useStores()
  const theme = useTheme()
  const onAddFriendPress = () => ui.setAddFriendDialog(true)

  return (
    <>
      <View style={{ ...styles.listHeader }}>
        <TouchableOpacity onPress={() => navigate('Contacts')} activeOpacity={0.6}>
          <Button mode='text' size='small'>
            Contacts
          </Button>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAddFriendPress} activeOpacity={0.6}>
          <Button
            mode='text'
            size='small'
            icon={() => <MaterialIcon name='plus' color={theme.primary} size={16} />}
            fs={13}
          >
            Add Friend
          </Button>
        </TouchableOpacity>
      </View>
      <Divider mt={8} mb={0} />
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    flex: 1,
  },
  listHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  searchWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingRight: 14,
    paddingLeft: 14,
  },
})
