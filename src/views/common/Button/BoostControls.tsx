import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import Toast from 'react-native-simple-toast'

import { useStores, useTheme } from '../../../store'
import Typography from '../Typography'

const BoostControls = (props) => {
  const { user, details, ui } = useStores()

  const [tip, setTip] = useState(100)
  const [plusDisabled, setPlusDisabled] = useState(false)
  const [minusDisabled, setMinusDisabled] = useState(tip <= 100 ? true : false)
  const theme = useTheme()

  useEffect(() => {
    // const amount = user.tipAmount || 100
    // if (amount < 100) {
    //   // Math.ceil(tip / 10) * 10

    //   setTip(100)
    // } else {
    //   setTip(amount)
    // }

    ui.setPodcastBoostAmount(100)
  }, [])

  //   useEffect(() => {
  //     if (tip) {
  //       ui.setPodcastBoostAmount(tip)
  //     }
  //   }, [tip])

  function handleIncrease() {
    setMinusDisabled(false)

    if (tip > details.balance) {
      Toast.showWithGravity('Not Enough Balance', Toast.SHORT, Toast.CENTER)
      setPlusDisabled(true)
      return
    }

    setTip((tip) => tip + 100)

    ui.setPodcastBoostAmount(tip + 100)
  }

  function handleDecrease() {
    setPlusDisabled(false)

    if (tip <= 200) {
      setMinusDisabled(true)
    }

    setTip((tip) => tip - 100)

    ui.setPodcastBoostAmount(tip - 100)
  }

  return (
    <View style={styles.wrap}>
      <IconButton
        icon='plus-circle-outline'
        color={theme.primary}
        disabled={plusDisabled}
        onPress={() => {
          if (!plusDisabled) {
            handleIncrease()
          }
        }}
      />

      <View style={styles.amount}>
        <Typography>{tip}</Typography>
        <Typography color={theme.subtitle}>sats</Typography>
      </View>

      <IconButton
        icon='minus-circle-outline'
        color={theme.primary}
        disabled={minusDisabled}
        onPress={() => {
          if (!minusDisabled) {
            handleDecrease()
          }
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
})

export default React.memo(BoostControls)
