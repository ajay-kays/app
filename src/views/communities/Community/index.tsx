import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TabView } from 'react-native-tab-view'
import { useStores, useTheme } from 'store'
import BackHeader from '../../common/BackHeader'
import Divider from '../../common/Layout/Divider'
import TribeSettings from '../../common/Dialogs/TribeSettings'
import Tabs from '../../common/Tabs'
import Intro from './Intro'
import About from './About'
import Media from './Media'
import { navigate } from 'nav'
import { display } from 'lib/logging'

const Community = ({ route }) => {
  const theme = useTheme()
  const navigation = useNavigation()
  const { chats, msg } = useStores()
  const isFocused = useIsFocused()

  const [tribeDialog, setTribeDialog] = useState(false)
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'first', title: 'Media' },
    { key: 'second', title: 'About' },
  ])

  const uuid = route.params.tribe.uuid
  const tribe = chats.communities.get(uuid)

  const chatId = tribe?.chat?.id

  // display({
  //   name: 'Community',
  //   preview: ' with what ',
  //   value: { uuid, tribe, chatId },
  //   important: true,
  // })

  useEffect(() => {
    // chats.getCommunities() -- for now
    if (chatId) {
      display({
        name: 'Community index',
        preview: 'getMessagesForChat going now...',
        important: true,
      })
      msg.getMessagesForChat(chatId)
    } else {
      console.log('NO CHATID...?')
    }
  }, []) // removing this: isFocused - do it ONCE ONLY

  const onEditCommunityPress = useCallback(() => {
    navigate('EditCommunity', { tribe })
  }, [])

  const onCommunityMembersPress = useCallback(() => {
    navigate('CommunityMembers', { tribe })
  }, [])

  const navigationBack = useCallback(() => {
    navigation.goBack()
  }, [])

  const openDialog = useCallback(() => {
    setTribeDialog(true)
  }, [])

  const renderScene = useCallback(({ route: renderSceneRoute }) => {
    switch (renderSceneRoute.key) {
      case 'first':
        return <Media tribe={tribe} />
      case 'second':
        return <About tribe={tribe} />
      default:
        return null
    }
  }, [])

  return (
    <SafeAreaView style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader navigate={navigationBack} action={<TribeHeader openDialog={openDialog} />} />

      <ScrollView>
        <View style={styles.content}>
          <Intro tribe={tribe} />
          <Divider mt={30} mb={0} />
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={(props) => <Tabs {...props} />}
          />
        </View>
      </ScrollView>

      <TribeSettings
        visible={tribeDialog}
        owner={tribe?.owner}
        onCancel={() => setTribeDialog(false)}
        onEditPress={onEditCommunityPress}
        onMembersPress={onCommunityMembersPress}
      />
    </SafeAreaView>
  )
}

function TribeHeader({ openDialog }) {
  // tribe
  const theme = useTheme()

  return (
    <IconButton
      icon={() => <MaterialCommunityIcon name='dots-horizontal' color={theme.icon} size={30} />}
      onPress={openDialog}
    />
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    // paddingBottom: 30
  },
  content: {
    flex: 1,
    paddingTop: 10,
    // paddingRight: 14,
    // paddingLeft: 14
  },
})

export default observer(Community)
