import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput, Chip } from 'react-native-paper'
import { useTheme } from 'store'
import Button from '../../common/Button'
import InputAccessoryView from '../../common/Accessories/InputAccessoryView'
import Typography from '../../common/Typography'

// const tagz = [
//   'Mobile',
//   'Analytics',
//   'Express',
//   'Engineering',
//   'Crypto',
//   'Tech',
//   'Altcoins',
//   'Music'
// ]

export default function TribeTags(props) {
  const {
    containerStyle,
    tags,
    displayOnly = false,
    saveAction = true,
    saveText = 'Save',
    btnMode = 'text',
    finish,
  } = props

  const theme = useTheme()
  const [tag, setTag] = useState('')
  const [error, setError] = useState('')
  const [tagz, setTagz] = useState<any>([])
  const nativeID = 'tag'

  useEffect(() => {
    setTagz(tags)
  }, [tags])

  // const [selectedTags, setSelectedTags] = useState(tags)

  function addTag() {
    if (!tag) return
    const newValues = [...tagz]

    if (tagz.length >= 5) {
      setError('Only five values are allowed!')
    } else if (newValues.includes(tag)) {
      setError('Value already exist!')
    } else if (tagz.length < 5) {
      setTagz([tag, ...newValues])
    } else {
    }

    setTag('')
  }

  function removeTag(tag) {
    const newValues = [...tagz]
    setTagz(newValues.filter((t) => t !== tag))
    setError('')
  }

  // function onChipPress(tag) {
  // const newValues = [...selectedTags]
  // if (newValues.includes(tag)) {
  //   setSelectedTags(newValues.filter(t => t !== tag))
  // } else if (selectedTags.length < 5) {
  //   setSelectedTags([tag, ...newValues])
  // }
  // }

  function renderTags() {
    if (displayOnly) {
      return (
        <>
          {tagz.map((t, i) => {
            return (
              <View key={i}>
                <Chip
                  key={t}
                  style={{
                    ...styles.chip,
                    backgroundColor: theme.main,
                  }}
                  textStyle={{ color: theme.text }}
                >
                  {t}
                </Chip>
              </View>
            )
          })}
        </>
      )
    } else {
      return (
        <>
          {tagz.length > 0 ? (
            <>
              {tagz.map((t, i) => {
                return (
                  <View key={i}>
                    <Chip
                      onClose={() => removeTag(t)}
                      key={t}
                      style={{
                        ...styles.chip,
                        backgroundColor: theme.main,
                      }}
                      textStyle={{ color: theme.text }}
                    >
                      {t}
                    </Chip>
                  </View>
                )
              })}
            </>
          ) : (
            <Typography size={16}></Typography>
          )}
        </>
      )
    }
  }

  return (
    <View style={containerStyle}>
      <View style={{ ...styles.content }}>
        {!displayOnly && (
          <>
            <View style={{ ...styles.inputWrap }}>
              <TextInput
                autoCompleteType='off'
                inputAccessoryViewID={nativeID}
                placeholder='Type topic: Art or Music...'
                value={tag}
                onChangeText={setTag}
                onFocus={() => setError('')}
                style={{ ...styles.input, backgroundColor: theme.bg }}
                underlineColor={theme.border}
              />
              <Typography color={theme.red} style={{ marginTop: 10 }}>
                {error}
              </Typography>
            </View>
            <InputAccessoryView nativeID={nativeID} done={addTag} doneText='Add' />
          </>
        )}

        <View style={{ ...styles.badgeContainer }}>{renderTags()}</View>
      </View>
      {!displayOnly && (
        <View
          style={{
            ...styles.buttonWrap,

            justifyContent: saveAction ? 'flex-end' : 'center',
          }}
        >
          <Button mode={btnMode} onPress={() => finish(tagz)} w={props.btnW ? props.btnW : 100}>
            {saveText}
          </Button>
        </View>
      )}
    </View>
  )
}

TribeTags.defaultProps = {
  containerStyle: null,
  finish: () => {},
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    width: '100%',
  },
  badgeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  inputWrap: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    textAlign: 'auto',
  },
})
