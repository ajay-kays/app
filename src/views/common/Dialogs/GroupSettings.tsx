import React from 'react'
import { useTheme } from 'store'
import ActionSheet from '../ActionSheet'

export default function GroupSettings({ visible, owner, onCancel, shareGroup, exitGroup }) {
  const theme = useTheme()
  const ownerItems = [
    {
      id: 1,
      label: 'Delete Community',
      onPress: () => exitGroup(),
      actionTextColor: theme.danger,
    },
  ]

  const userItems = [
    {
      id: 1,
      label: 'Exit Community',
      onPress: () => exitGroup(),
      actionTextColor: theme.danger,
    },
  ]

  const commonItems = [
    {
      id: 1,
      label: 'Share Community',
      onPress: () => shareGroup(),
    },
  ]

  const items = owner ? [...commonItems, ...ownerItems] : [...commonItems, ...userItems]

  return <ActionSheet visible={visible} items={items} onCancel={onCancel} />
}
