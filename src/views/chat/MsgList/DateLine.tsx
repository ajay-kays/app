import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from 'store'
import { Typography } from 'views/common'

export const DateLine = ({ dateString }) => {
  const theme = useTheme()
  return (
    <View style={{ ...styles.dateLine }}>
      <View style={{ ...styles.dateString, backgroundColor: theme.main }}>
        <Typography size={12} color={theme.subtitle}>
          {dateString}
        </Typography>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  dateLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    height: 22,
    width: '100%',
    marginTop: 30,
  },
  dateString: {
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 15,
  },
  refreshingWrap: {
    position: 'absolute',
    zIndex: 102,
    top: 55,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
})
