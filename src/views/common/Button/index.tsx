import React from 'react'
import { Button as PaperButton } from 'react-native-paper'

import { useTheme } from '../../../store'

export default function Button(props) {
  const theme = useTheme()
  let {
    pushable,
    mode,
    accessibilityLabel,
    color = theme.primary,
    style,
    round,
    fs,
    fw,
    h,
    w,
    tf,
    labelStyle,
    loading,
    disabled,
    onPress,
    dark,
    icon,
    children,
    size,
    ph,
  } = props

  let defaultFs = 13
  let defaultHeight = 45
  let defaultFw = '500'

  if (size === 'large') {
    defaultFs = 14
    defaultHeight = 50
  } else if (size === 'small') {
    defaultHeight = 35
  } else {
    // medium size
    defaultHeight = 45
  }

  const height = h ? h : defaultHeight
  const fontSize = fs ? fs : defaultFs
  const fontWeight = fw ? fw : defaultFw
  const borderRadius = round === 0 ? 0 : round ? round : 25

  return (
    <PaperButton
      mode={mode}
      accessibilityLabel={accessibilityLabel}
      loading={loading}
      disabled={disabled}
      onPress={!pushable && onPress}
      style={{ ...style, borderRadius, width: w }}
      labelStyle={{
        ...labelStyle,
        fontSize,
        fontWeight,
        textTransform: tf ? tf : 'uppercase',
      }}
      contentStyle={{ height, paddingHorizontal: ph }}
      dark={dark}
      icon={icon}
      color={color}
    >
      {children}
    </PaperButton>
  )
}

Button.defaultProps = {
  mode: 'contained',
  size: 'medium',
}
