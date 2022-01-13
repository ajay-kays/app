import React from 'react'
import { Text } from 'react-native'
import { Dialog } from 'react-native-paper'
import { useStores, useTheme } from '../../store'
import { observer } from 'mobx-react-lite'

export const RestoringMessages = observer(({ visible }: any) => {
  const theme = useTheme()
  const { ui } = useStores()
  const messagesRestored = ui.restoredMessages
  return <></>
  return (
    <Dialog visible={visible} style={{ bottom: 10 }} dismissable={false}>
      <Dialog.Title>Restoring Messages...</Dialog.Title>
      <Dialog.Actions
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Text style={{ color: theme.title, padding: 12 }}>
          Restored {messagesRestored} messages
        </Text>
      </Dialog.Actions>
    </Dialog>
  )
})
