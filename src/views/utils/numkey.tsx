import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { IconButton } from 'react-native-paper'
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import { useTheme } from 'store'
import Typography from '../common/Typography'

const keys = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  ['_', 0, 'back'],
]

export default function NumKey(props) {
  const theme = useTheme()
  const h = props.squish ? 240 : 275

  const inline = props.inline ? true : false

  return (
    <View
      style={{
        ...styles.wrap,
        backgroundColor: props.dark ? theme.black : theme.bg,
        paddingTop: inline ? 0 : 15,
        paddingBottom: inline ? 0 : isIphoneX() ? getBottomSpace() : 0,
      }}
    >
      <View
        style={{
          height: h,
          maxHeight: h,
          minHeight: h,
        }}
      >
        {keys.map((row, i) => {
          return (
            <View key={i} style={{ ...styles.row }}>
              {row.map((key) => {
                if (key === '_') return <View key={key} style={styles.empty} />
                if (key === 'back') {
                  return (
                    <TouchableOpacity
                      key={key}
                      style={styles.backWrap}
                      onPress={() => {
                        if (props.onBackspace) props.onBackspace()
                      }}
                    >
                      <IconButton
                        icon='backspace'
                        color={props.dark ? theme.white : theme.subtitle}
                        accessibilityLabel={`pin-number-backspace`}
                      />
                    </TouchableOpacity>
                  )
                }
                return (
                  <TouchableOpacity
                    accessibilityLabel={`pin-number-key-${key}`}
                    key={key}
                    style={styles.key}
                    onPress={() => {
                      if (props.onKeyPress) props.onKeyPress(key)
                    }}
                  >
                    <Typography
                      size={24}
                      color={props.dark ? theme.white : theme.subtitle}
                      fw='500'
                    >
                      {key}
                    </Typography>
                  </TouchableOpacity>
                )
              })}
            </View>
          )
        })}
      </View>
    </View>
  )
}

NumKey.defaultProps = {
  dark: false,
}

const styles = StyleSheet.create({
  wrap: {
    // flex: 1,
    // justifyContent: 'flex-end',
    // width: '100%'
    // height: '100%'
  },
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: '25%',
  },
  key: {
    width: '33.33%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    width: '33.33%',
  },
  backWrap: {
    width: '33.33%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
