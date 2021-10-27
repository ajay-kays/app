import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'store'

export default function Divider(props) {
  let { color, h = 1, w = '100%', pt, pb, pr, pl, mt = 20, mb = 20 } = props
  const theme = useTheme()

  const borderColor = color ? color : theme.border

  const borderStyles = {
    borderBottomColor: borderColor,
    borderBottomWidth: h,
    paddingTop: pt,
    paddingBottom: pb,
    paddingLeft: pl,
    paddingRight: pr,
    marginTop: mt,
    marginBottom: mb,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: w,
  }

  return <View style={{ ...borderStyles }}></View>
}
