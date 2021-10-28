import React, { useEffect, useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet, View, Modal, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import { useTheme, useStores } from '../../../store'
import { TRIBE_SIZE_LIMIT } from 'lib/constants'
import Button from '../../common/Button'
import Typography from '../../common/Typography'
import { Contact, SelectedContact } from './Items'

export default function AddMembers({ initialMemberIds, loading, finish }) {
  const theme = useTheme()
  const { contacts } = useStores()
  const [selected, setTheSelected] = useState<any>([])

  function setSelected(a) {
    setTheSelected(a)
  }

  function add(id) {
    const sel = [...selected]
    if (sel.includes(id)) {
      setSelected(sel.filter((x) => x !== id))
    } else {
      if (sel.length < TRIBE_SIZE_LIMIT || 20) {
        sel.push(id)
        setSelected(sel)
      }
    }
  }

  const initialContactIds = initialMemberIds || []
  const initialContactsToShow = contacts.contactsArray.filter((c) => {
    return initialContactIds.includes(c.id)
  })

  const noInitials = !(initialMemberIds && initialMemberIds.length)

  const contactsToShow = contacts.contactsArray.filter(
    (c) => c.id > 1 && !initialContactIds.includes(c.id)
  )
  const selectedContacts = contactsToShow.filter((c) => selected.includes(c.id))

  const showSelectedContacts = selectedContacts.length + initialContactsToShow.length > 0
  function selectAll() {
    setSelected(contactsToShow.map((c) => c.id))
  }

  const renderContactsToShow: any = ({ item, index }) => (
    <Contact
      key={index}
      contact={item}
      onPress={() => add(item.id)}
      selected={selected.includes(item.id)}
    />
  )

  const flatListHeader: any = () => (
    <View style={styles.topBar}>
      <Typography>CONTACTS</Typography>
      {!noInitials && (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={selectAll}
          accessibilityLabel='people-select-all'
        >
          <Typography>SELECT ALL</Typography>
        </TouchableOpacity>
      )}
    </View>
  )

  const listFooterComponent: any = () => (
    <View style={styles.buttonWrap}>
      <Button w='25%' loading={loading} onPress={() => finish(selected)}>
        Finish
      </Button>
      <Button
        onPress={() => finish([])}
        w='18%'
        color={theme.lightGrey}
        style={{ marginRight: 14, marginLeft: 20 }}
      >
        <Typography color={theme.black}> Skip</Typography>
      </Button>
    </View>
  )

  return useObserver(() => (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <>
        {/* {showSelectedContacts && (
          <ScrollView horizontal={true} style={styles.selContacts}>
            {initialContactsToShow.map((cts, i) => {
              return (
                <SelectedContact
                  key={i}
                  contact={cts}
                  onPress={() => {}}
                  removable={false}
                />
              )
            })}
            {selectedContacts.map((sc, i) => {
              return (
                <SelectedContact
                  key={i}
                  contact={sc}
                  onPress={() => add(sc.id)}
                  removable={true}
                />
              )
            })}
          </ScrollView>
        )} */}

        <FlatList
          style={styles.scroller}
          data={contactsToShow}
          renderItem={renderContactsToShow}
          keyExtractor={(item: any) => String(item.id)}
          ListHeaderComponent={flatListHeader}
          ListFooterComponent={listFooterComponent}
        />
      </>
    </View>
  ))
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    position: 'relative',
  },
  scroller: {
    // width: '100%'
  },
  topBar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 14,
    marginTop: 10,
  },
  selContacts: {
    height: 90,
    maxHeight: 90,
    width: '100%',
  },
  buttonWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 30,
  },
  button: {},
})
