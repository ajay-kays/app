import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useTheme } from 'store'
import NumKey from '../../../utils/numkey'
import Typography from '../../Typography'
import Button from '../../Button'

export default function SetPrice({ setAmount, onShow }) {
  const theme = useTheme()
  const [price, setPrice] = useState('SET PRICE')
  const [showNum, setShowNum] = useState(false)
  const [amt, setAmt] = useState('0')

  function go(n) {
    if (amt === '0') setAmt(`${n}`)
    else setAmt(`${amt}${n}`)
  }
  function backspace() {
    if (amt.length === 1) {
      setAmt('0')
    } else {
      const newAmt = amt.substr(0, amt.length - 1)
      setAmt(newAmt)
    }
  }

  function open() {
    onShow()
    setShowNum(!showNum)
  }

  return useObserver(() => (
    <>
      <TouchableOpacity
        activeOpacity={0.6}
        style={{ ...styles.priceButton, backgroundColor: theme.secondary }}
        onPress={open}
      >
        <Typography color={theme.white} size={14}>
          {price}
        </Typography>
      </TouchableOpacity>
      {showNum && (
        <View style={{ ...styles.num, backgroundColor: theme.bg }}>
          <View style={styles.amtWrap}>
            <Typography size={37}>{amt}</Typography>
            <Typography size={16} color={theme.subtitle} style={styles.sat}>
              sat
            </Typography>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <NumKey onKeyPress={(v) => go(v)} onBackspace={() => backspace()} squish inline />
          </View>

          <View
            style={{
              ...styles.confirmWrap,
              opacity: amt && amt !== '0' ? 1 : 0,
            }}
          >
            <Button
              size='small'
              w={130}
              h={40}
              onPress={() => {
                setPrice(`${amt} sat`)
                setShowNum(false)
                setAmount(parseInt(amt))
              }}
            >
              CONFIRM
            </Button>
          </View>
        </View>
      )}
    </>
  ))
}

const styles = StyleSheet.create({
  priceButton: {
    position: 'absolute',
    top: 90,
    left: 20,
    height: 32,
    minWidth: 90,
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  num: {
    borderRadius: 10,
    width: 240,
    height: 400,
    position: 'absolute',
    top: 140,
    left: 20,
    zIndex: 999,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 14,
  },
  amtWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  sat: {
    position: 'absolute',
    right: 28,
    top: 5,
  },
  confirmWrap: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
