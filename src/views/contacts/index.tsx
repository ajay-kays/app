import React from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useStores, useTheme } from '../../store'
import BackHeader from '../common/BackHeader'
import Search from '../common/Search'
import ContactList from './ContactList'
import Contact from './Contact'

export { Contact }

function ContactsFC() {
  const { ui } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const onAddFriendPress = () => ui.setAddFriendDialog(true)

  const AddContact = (
    <IconButton
      icon={({ size, color }) => <AntDesign name='adduser' color={color} size={size} />}
      color={theme.primary}
      size={22}
      onPress={onAddFriendPress}
    />
  )

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Contacts' action={AddContact} navigate={() => navigation.goBack()} />
      <View style={{ ...styles.content }}>
        <ContactList listHeader={<ListHeader />} />
      </View>
    </View>
  )
}

export const Contacts = observer(ContactsFC)

function ListHeader() {
  const { ui } = useStores()

  const onChangeTextHandler = (txt: string) => ui.setContactsSearchTerm(txt)

  return (
    <View style={{ ...styles.searchWrap }}>
      <Search
        placeholder='Search Contacts'
        onChangeText={onChangeTextHandler}
        value={ui.contactsSearchTerm}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  searchWrap: {
    paddingRight: 14,
    paddingLeft: 14,
    paddingBottom: 14,
  },
})
