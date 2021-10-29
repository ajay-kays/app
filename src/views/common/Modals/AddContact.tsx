import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '../../../store'
import Form from '../../form'
import * as schemas from '../../form/schemas'
import ModalWrap from './ModalWrap'
import ModalHeader from './ModalHeader'

export default function AddContact() {
  const { ui, contacts, user } = useStores()
  const [loading, setLoading] = useState(false)

  function close() {
    ui.setAddContactModal(false)
  }

  return useObserver(() => (
    <ModalWrap onClose={close} visible={ui.addContactModal} noSwipe>
      <ModalHeader title='Add Contact' onClose={close} />
      <View style={styles.content}>
        <Form
          schema={schemas.contact}
          loading={loading}
          buttonAccessibilityLabel='add-friend-form-button'
          buttonText='Save'
          onSubmit={async (values) => {
            try {
              setLoading(true)
              await contacts.addContact(values)
              setLoading(false)
              close()
            } catch (error) {
              await user.reportError('Add Contact', error)
            }
          }}
        />
      </View>
    </ModalWrap>
  ))
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
})
