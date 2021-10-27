import React, { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useStores, useTheme } from 'store'
import Form from '../../form'
import * as schemas from '../../form/schemas'
import { BackHeader } from 'views/common'

export default function EditTribe({ route }) {
  const { chats } = useStores()
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const navigation = useNavigation()

  const tribe = route.params.tribe

  tribe.escrow_time = tribe.escrow_millis ? Math.floor(tribe.escrow_millis / (60 * 60 * 1000)) : 0

  async function finish(v) {
    setLoading(true)

    await chats.editTribe({
      ...v,
      id: tribe.chat.id,
    })

    setTimeout(() => {
      setLoading(false)
      navigation.goBack()
    }, 150)
  }

  return (
    <>
      <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <BackHeader title={`Edit ${tribe.name}`} navigate={() => navigation.goBack()} />
        <ScrollView style={styles.scroller} contentContainerStyle={styles.container}>
          <Form
            schema={schemas.tribe}
            loading={loading}
            buttonAccessibilityLabel='edit-tribe-form-button'
            buttonText='Save'
            onSubmit={finish}
            initialValues={{
              ...tribe,
              host: tribe.chat.host,
              is_private: tribe.private,
            }}
          />
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    // display: 'flex',
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // width: '100%',
    // minHeight: 400
  },
  scroller: {
    width: '100%',
    flex: 1,
    display: 'flex',
  },
  container: {
    width: '100%',
    paddingBottom: 20,
  },
})
