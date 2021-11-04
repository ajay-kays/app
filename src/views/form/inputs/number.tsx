import React from 'react'
import { StyleSheet } from 'react-native'
import { TextInput } from 'react-native-paper'
import { useTheme } from 'store'
import InputAccessoryView from '../../common/Accessories/InputAccessoryView'
import Typography from '../../common/Typography'
// import QDialog from './qDialog'

export default function NumberInput({
  name,
  label,
  required,
  error,
  handleBlur,
  setValue,
  value,
  displayOnly,
  description,
  accessibilityLabel,
  style,
}) {
  const theme = useTheme()
  let lab = `${label.en}${required ? ' *' : ''}`
  // if (error) {
  //   lab = `${label.en} - ${error}`
  // }
  if (displayOnly) lab = label.en

  return (
    <>
      <Typography size={14} color={theme.title}>
        {lab}
      </Typography>
      <TextInput
        autoCompleteType='off'
        accessibilityLabel={accessibilityLabel}
        keyboardType='numeric'
        error={error}
        style={{ ...styles.inputStyles, ...style, backgroundColor: theme.bg }}
        onChangeText={(e) => setValue(parseInt(e))}
        onBlur={handleBlur(name)}
        value={value || value === 0 ? value + '' : ''}
        inputAccessoryViewID={name}
        underlineColor={theme.border}
      />
      {/* {description && <QDialog description={description} label={label.en} />} */}

      <InputAccessoryView nativeID={name} />
    </>
  )
}

const styles = StyleSheet.create({
  inputStyles: {
    marginBottom: 16,
    maxHeight: 55,
  },
})
