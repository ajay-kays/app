import React from 'react'
import { Searchbar } from 'react-native-paper'
import FeatherIcon from 'react-native-vector-icons/Feather'

import { useTheme } from '../../../store'
import Icon from '../Icon'

export default function Search(props) {
  const { placeholder, value, onChangeText, style, h, round } = props

  const theme = useTheme()

  const borderRadius = round ? round : 8

  const styles = {
    ...style,
    elevation: 0,
    height: h,
    backgroundColor: theme.inputBg,
    borderRadius,
  }
  const iconColor = theme.icon
  const inputStyle = {
    color: theme.input,
    fontSize: 15,
    paddingLeft: 0,
  }
  const placeholderTextColor = theme.placeholder

  return (
    <Searchbar
      autoCompleteType='off'
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={styles}
      inputStyle={inputStyle}
      iconColor={iconColor}
      placeholderTextColor={placeholderTextColor}
      clearIcon={(props) => <ClearIcon value={value} />}
      icon={(props) => <FeatherIcon name='search' color={theme.icon} size={18} />}
    />
  )
}

function ClearIcon({ value }) {
  const theme = useTheme()
  return <Icon name='Close' color={value ? theme.icon : 'transparent'} size={18} />
}

Search.defaultProps = {
  h: 40,
}
