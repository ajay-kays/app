import React from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useTheme } from '../../store'
import TabBar from '../common/TabBar'
import Header from './Header'
import OwnedCommunities from './OwnedCommunities'

const CommunitiesFC = () => {
  const theme = useTheme()
  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Header />
      <OwnedCommunities />
      <TabBar />
    </View>
  )
}

export const Communities = observer(CommunitiesFC)

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  searchWrap: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 14,
    paddingLeft: 14,
  },
})
