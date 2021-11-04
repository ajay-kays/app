import React from 'react'
import { observer } from 'mobx-react-lite'
import { IconButton } from 'react-native-paper'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { useStores, useTheme } from 'store'
import Menu from '../ActionSheet/Menu'

function AddFriend() {
  const { ui } = useStores()
  const theme = useTheme()

  function close() {
    ui.setAddFriendDialog(false)
  }

  const items = [
    {
      title: 'Already on Zion',
      thumbIcon: (
        <IconButton
          icon={({ size, color }) => <AntDesignIcon name='adduser' color={color} size={size} />}
          color={theme.white}
          size={18}
        />
      ),
      description: 'Add to your contact',
      thumbBgColor: theme.primary,
      action: () => {
        close()
        setTimeout(() => {
          ui.setAddContactModal(true)
        }, 400)
      },
    },
  ]

  return <Menu visible={ui.addFriendDialog} items={items} onCancel={close} />
}

export default observer(AddFriend)
