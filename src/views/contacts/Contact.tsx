import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { IconButton, Switch } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useStores, useTheme } from '../../store'
import { constants } from 'lib/constants'
import { usePicSrc } from '../utils/picSrc'
import ConfirmDialog from '../utils/confirmDialog'
import * as schemas from '../form/schemas'
import Form from '../form'
import BackHeader from '../common/BackHeader'
import Button from '../common/Button'
import Typography from '../common/Typography'

const conversation = constants.chat_types.conversation

function EditContact({ route }) {
  const { ui, contacts, chats } = useStores()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [sub, setSub] = useState(false)
  const [existingSub, setExistingSub] = useState<any>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigation = useNavigation()

  const contact = route.params.contact

  useEffect(() => {
    fetchSubscription()
  }, [])

  async function fetchSubscription() {
    const chat = chatForContact()
    const isConversation = chat && chat.type === constants.chat_types.conversation
    if (isConversation) {
      const s = await contacts.getSubscriptionForContact(contact.id)
      if (s && s[0]) setExistingSub(s[0])
    }
  }

  async function updateContact(values) {
    setLoading(true)
    if (contact.alias !== values.alias) {
      await contacts.updateContact(contact.id, {
        alias: values.alias,
      })
    }
    setLoading(false)
  }

  function chatForContact() {
    const cfc = chats.chatsArray.find((c) => {
      return c.type === conversation && c.contact_ids.includes(contact.id)
    })
    return cfc
  }

  async function toggleSubscription(sid, paused: boolean) {
    const ok = await contacts.toggleSubscription(sid, paused)
    if (ok)
      setExistingSub((current) => {
        return { ...current, paused }
      })
  }

  const uri = usePicSrc(contact)

  const subPaused = existingSub && existingSub.paused ? true : false

  const Subscribe = (
    <>
      {sub && existingSub && existingSub.id && (
        <View style={styles.row}>
          <IconButton
            icon='trash-can-outline'
            color={theme.icon}
            size={22}
            style={{ marginRight: 12 }}
            onPress={() => setShowConfirm(true)}
          />
          <View style={styles.row}>
            <Typography style={{ ...styles.pausedText, color: theme.subtitle }}>
              {subPaused ? 'PAUSED' : 'ACTIVE'}
            </Typography>
            <Switch
              value={!subPaused}
              onValueChange={() => toggleSubscription(existingSub.id, subPaused ? false : true)}
            />
          </View>
        </View>
      )}
    </>
  )

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Edit Contact' navigate={() => navigation.goBack()} action={Subscribe} />

      <View style={styles.content}>
        <Form
          schema={schemas.contactEdit}
          loading={loading}
          buttonText='Save'
          initialValues={
            contact
              ? {
                  alias: contact.alias,
                  public_key: contact.public_key,
                }
              : {}
          }
          readOnlyFields={'public_key'}
          onSubmit={(values) => updateContact(values)}
        />
      </View>

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false)
          contacts.deleteSubscription(existingSub.id)
          // setSub(false)
          setExistingSub(null)
        }}
      />
    </View>
  )
}

export default observer(EditContact)

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pausedText: {
    fontSize: 12,
    minWidth: 50,
  },
})
