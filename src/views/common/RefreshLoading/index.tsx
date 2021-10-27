import React from 'react'
import { RefreshControl } from 'react-native'

import { useTheme } from '../../../store'

export default function RefreshLoading(props) {
  const { refreshing, onRefresh, title } = props
  const theme = useTheme()

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      title={title}
      tintColor={theme.icon}
      titleColor={theme.subtitle}
    />
  )
}

RefreshLoading.defaultProps = {
  title: '',
}
