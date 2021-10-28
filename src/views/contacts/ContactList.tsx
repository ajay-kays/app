import React from 'react'
import { observer } from 'mobx-react-lite'
import { StyleSheet, View, TouchableOpacity, SectionList } from 'react-native'
import { SwipeRow } from 'react-native-swipe-list-view'
import { IconButton } from 'react-native-paper'
import { useStores, useTheme } from '../../store'
import { usePicSrc } from '../utils/picSrc'
import Avatar from '../common/Avatar'
import Typography from '../common/Typography'
import { navigate } from 'nav'

function ContactList({ listHeader }) {
  const { user, ui, contacts } = useStores()
  const theme = useTheme()
  const myid = user.myid

  const contactsToShow = contacts.contactsArray.filter((c) => {
    if (!ui.contactsSearchTerm) return true
    return c.alias.toLowerCase().includes(ui.contactsSearchTerm.toLowerCase())
  })
  const contactsNotMe = contactsToShow
    .filter((c) => c.id !== myid)
    .sort((a, b) => (a.alias > b.alias ? 1 : -1))

  const contactsNotFromGroups = contactsNotMe.filter((c) => !c.from_group)

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <SectionList
        style={styles.list}
        sections={grouper(contactsNotFromGroups)}
        keyExtractor={(item: { [k: string]: any }, index) => {
          return item.alias + index + item.photo_url
        }}
        renderItem={({ item }) => (
          <Item contact={item} onPress={(contact) => navigate('Contact', { contact })} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={{ ...styles.section, backgroundColor: theme.main }}>
            <Typography color={theme.title} fw='500'>
              {title}
            </Typography>
          </View>
        )}
        ListHeaderComponent={listHeader}
      />
    </View>
  )
}

export default observer(ContactList)

function Item({ contact, onPress }) {
  const { contacts } = useStores()
  const theme = useTheme()
  let uri = usePicSrc(contact)
  const hasImg = uri ? true : false

  return (
    <SwipeRow disableRightSwipe={true} friction={100} rightOpenValue={-80} stopRightSwipe={-80}>
      <View style={styles.backSwipeRow}>
        <IconButton
          icon='trash-can-outline'
          color='white'
          size={25}
          onPress={() => contacts.deleteContact(contact.id)}
          style={{ marginRight: 20 }}
        />
      </View>
      <View style={{ ...styles.frontSwipeRow, backgroundColor: theme.bg }}>
        <TouchableOpacity
          style={styles.contactTouch}
          activeOpacity={0.5}
          onPress={() => onPress(contact)}
        >
          <Avatar size={40} aliasSize={16} alias={contact.alias} photo={uri} />
          <View style={styles.contactContent}>
            <Typography size={16}>{contact.alias}</Typography>
          </View>
        </TouchableOpacity>
      </View>
    </SwipeRow>
  )
}

function grouper(data) {
  // takes "alias"
  const ret: any[] = []
  const groups = data.reduce((r, e) => {
    let title = e.alias && e.alias[0]
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
    flex: 1,
  },
  list: {
    flex: 1,
  },
  section: {
    paddingLeft: 24,
    height: 35,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactTouch: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 80,
    alignItems: 'center',
  },
  contactContent: {
    flex: 1,
    paddingLeft: 14,
  },
  backSwipeRow: {
    backgroundColor: '#DB5554',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  frontSwipeRow: {
    flex: 1,
    height: 80,
    paddingLeft: 14,
  },
})
