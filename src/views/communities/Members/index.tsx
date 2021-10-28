import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { useStores, useTheme } from '../../../store'
import BackHeader from '../../common/BackHeader'
import List from './List'
import Pending from './Pending'
import AddMembers from './AddMembers'
// import AddMemberModal from '../../common/Modals/Tribe/AddMembers'
import Typography from '../../common/Typography'
import Empty from '../../common/Empty'
import Search from '../../common/Search'
import { SCREEN_WIDTH } from 'lib/constants'

function Members({ route }) {
  const [addMember, setAddMember] = useState(false)
  const { contacts } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()
  const [membersSearchText, setMembersSearchText] = useState('')

  const tribe = route.params.tribe

  useEffect(() => {
    contacts.getContacts()
  })

  const contactsToShow = contacts.contactsArray.filter((c) => {
    return c.id > 1 && tribe && tribe.chat && tribe.chat.contact_ids.includes(c.id)
  })

  const searchedContacts = contactsToShow.filter((m) => {
    if (!membersSearchText) return true
    return m.alias.toLowerCase().includes(membersSearchText.toLowerCase())
  })

  const pendingContactsToShow =
    contacts.contactsArray.filter((c) => {
      return (
        c.id > 1 &&
        tribe &&
        tribe.chat &&
        tribe.chat.pending_contact_ids &&
        tribe.chat.pending_contact_ids.includes(c.id)
      )
    }) || []

  return (
    <>
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <BackHeader
          // title={`${tribe.name} Members`}
          title='Members'
          navigate={() => navigation.goBack()}
          // action={tribe.owner && <MemberHeader openDialog={() => setAddMember(true)} />}
        />
        <View style={styles.content}>
          {contactsToShow && contactsToShow.length > 0 ? (
            <List
              tribe={tribe}
              members={searchedContacts}
              listHeader={
                <ListHeader
                  tribe={tribe}
                  searchText={membersSearchText}
                  setSearchText={setMembersSearchText}
                />
              }
            />
          ) : (
            <EmptyMembers tribe={tribe} />
          )}
          {/* <Pending tribe={tribe} members={pendingContactsToShow} /> */}
          {/* <AddMemberModal visible={addMember} close={() => setAddMember(false)}>
              <AddMembers initialMemberIds={(tribe && tribe.chat.contact_ids) || []} />
            </AddMemberModal> */}
        </View>
      </View>
    </>
  )
}

export default observer(Members)

function ListHeader({ tribe, searchText, setSearchText }) {
  return (
    <View style={{ ...styles.searchWrap }}>
      <Search
        // placeholder={`Search ${tribe.name} Members`}
        placeholder='Search'
        onChangeText={(value) => setSearchText(value)}
        value={searchText}
      />
    </View>
  )
}

function EmptyMembers({ tribe }) {
  const theme = useTheme()

  return (
    <Empty w={SCREEN_WIDTH - 100}>
      <Typography color={theme.subtitle} size={14} textAlign='center'>
        {`There are no members in ${tribe.name}.`}
      </Typography>
    </Empty>
  )
}

// function MemberHeader({ openDialog }) {
//   const theme = useTheme()

//   return (
//     <IconButton
//       icon={() => <AntDesignIcon name='addusergroup' color={theme.white} size={24} />}
//       style={{ backgroundColor: theme.primary }}
//       onPress={openDialog}
//     />
//   )
// }

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
