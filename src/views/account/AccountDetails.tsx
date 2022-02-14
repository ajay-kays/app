import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Switch } from 'react-native'
import { TextInput } from 'react-native-paper'
import { useStores, useTheme } from '../../store'
import BackHeader from '../common/BackHeader'
import InputAccessoryView from '../common/Accessories/InputAccessoryView'
import * as schemas from '../form/schemas'
import Form from '../form'
import Typography from '../common/Typography'

export default function AccountDetails() {
  const { user, contacts } = useStores()
  const [tipAmount, setTipAmount] = useState(user.tipAmount + '')
  const [loading, setLoading] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const me = contacts.contactsArray.find((c) => c.id === user.myid)
  const nativeID = 'tipAmount'

  useEffect(() => {
    const privatePhotoStatus = me?.private_photo ? false : true
    setIsEnabled(privatePhotoStatus)
  }, [])

  const theme = useTheme()

  function tipAmountChange(ta) {
    const int = parseInt(ta)
    setTipAmount(int ? int + '' : '')
  }

  function toggleSwitch() {
    setIsEnabled(!isEnabled)
    shareContactKey()
  }

  async function save() {
    setLoading(true)
    user.setTipAmount(parseInt(tipAmount))

    await contacts.updateContact(user.myid, {
      tip_amount: user.tipAmount,
    })
    setLoading(false)
  }

  async function shareContactKey() {
    const contact_key = me?.contact_key

    if (!contact_key) return
    await contacts.updateContact(user.myid, { contact_key, private_photo: isEnabled })
  }

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <BackHeader title='Details' />
      <View style={styles.content}>
        <Form
          nopad
          displayOnly
          schema={schemas.pubKey}
          loading={loading}
          buttonText='Save'
          initialValues={
            user
              ? {
                public_key: user.publicKey,
              }
              : {}
          }
          readOnlyFields={'public_key'}
        />
        <View style={styles.shareWrap}>
          <Typography size={14}>Share my profile photo with contacts</Typography>
          <Switch
            trackColor={{ false: theme.grey, true: theme.primary }}
            thumbColor={theme.white}
            ios_backgroundColor={theme.grey}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <Typography size={14}>Tip Amount</Typography>
        <TextInput
          // returnKeyType='done'
          inputAccessoryViewID={nativeID}
          keyboardType='number-pad'
          placeholder='Default Tip Amount'
          value={tipAmount + ''}
          onChangeText={tipAmountChange}
          style={{ height: 50, backgroundColor: theme.bg }}
          underlineColor={theme.border}
          autoCompleteType='off'
        />
        <InputAccessoryView nativeID={nativeID} done={save} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  content: {
    marginTop: 40,
    paddingRight: 18,
    paddingLeft: 18,
  },
  shareWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },
})
