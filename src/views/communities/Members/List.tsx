import React, { useState } from 'react'
import { StyleSheet, View, FlatList, SectionList } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'

import { useStores, useTheme } from '../../../store'
import { constants } from 'lib/constants'
import { Contact, DeletableContact, PendingContact } from './Items'
import Typography from '../../common/Typography'

function List({ tribe, members, listHeader }) {
  const { chats } = useStores()
  const theme = useTheme()

  async function onKickContact(cid) {
    await chats.kick(tribe.id, cid)
  }

  const renderItem: any = ({ item, index }: any) => {
    if (tribe.owner) {
      return <DeletableContact key={index} contact={item} onDelete={onKickContact} />
    }
    return <Contact key={index} contact={item} unselectable={true} />
  }

  return (
    <SectionList
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      // scrollEnabled={false}
      style={styles.wrap}
      sections={grouper(members)}
      // data={members}
      renderItem={renderItem}
      renderSectionHeader={({ section: { title } }) => (
        <View style={{ ...styles.section, backgroundColor: theme.main }}>
          <Typography color={theme.title} fw='500'>
            {title}
          </Typography>
        </View>
      )}
      ListHeaderComponent={listHeader}
      keyExtractor={(item) => String(item.id)}
    />
  )
}

export default observer(List)

function grouper(data) {
  // takes "alias"
  const ret: any = []
  const groups = data.reduce((r, e) => {
    let title = e.alias[0]
    if (!r[title]) r[title] = { title, data: [e] }
    else r[title].data.push(e)
    return r
  }, {})
  Object.values(groups).forEach((g) => {
    ret.push(g)
  })
  return ret
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    position: 'relative',
  },
  section: {
    paddingLeft: 24,
    height: 35,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
