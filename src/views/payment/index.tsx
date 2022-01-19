import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import { useStores, useTheme } from '../../store'
import { isLN, parseLightningInvoice, removeLightningPrefix } from '../utils/ln'
import TabBar from '../common/TabBar'
import Header from './Header'
import Transactions from './Transactions'
import Button from '../common/Button'
import QR from '../common/Accessories/QR'
import Typography from '../common/Typography'
import { setTint } from '../common/StatusBar'
import AddSats from './AddSats'
import { display } from 'lib/logging'

function PaymentFC() {
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [payments, setPayments] = useState([])

  const { ui, details } = useStores()
  const theme = useTheme()

  function isMsgs(msgs): boolean {
    const m = msgs && msgs.length && msgs[0]
    if (m.message_content || m.message_content === '' || m.message_content === null) {
      // needs this field
      return true
    }
    return false
  }

  useEffect(() => {
    setLoading(true)
    fetchBalance()
    fetchPayments()
    setTimeout(() => {
      setLoading(false)
    }, 400)
  }, [])

  async function fetchBalance() {
    await details.getChannelBalance()
    await details.getBalance()
    await details.getUSDollarRate()
  }

  async function fetchPayments() {
    const ps = await details.getPayments()
    display({
      name: 'fetchPayments',
      important: true,
      preview: 'wwat?',
      value: { ps },
    })
    if (!isMsgs(ps)) return
    setPayments(ps)
  }

  async function onRefresh() {
    setRefreshing(true)
    fetchPayments()
    fetchBalance()

    setRefreshing(false)
  }

  async function scanningDone(data) {
    if (isLN(data)) {
      const theData = removeLightningPrefix(data)
      const inv = parseLightningInvoice(data)
      if (!(inv && inv.human_readable_part && inv.human_readable_part.amount)) return
      const millisats = parseInt(inv.human_readable_part.amount, 10)
      const sats = millisats && Math.round(millisats / 1000)
      setScanning(false)

      setTimeout(() => {
        ui.setConfirmInvoiceMsg({ payment_request: theData, amount: sats })
      }, 150)
    }
  }

  return (
    <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
      <Header
        onScanClick={() => {
          setTint('dark')
          setScanning(true)
        }}
      />

      <Transactions
        payments={payments}
        refreshing={refreshing}
        loading={loading}
        onRefresh={onRefresh}
        listHeader={<ListHeader />}
      />
      <QR
        visible={scanning}
        onCancel={() => {
          setTint(theme.dark ? 'dark' : 'light')
          setScanning(false)
        }}
        confirm={scanningDone}
        showPaster={true}
        inputPlaceholder='Paste Invoice or Subscription code'
      />
      <TabBar />
    </View>
  )
}

const Payment = observer(PaymentFC)

export { AddSats, Payment }

const ListHeader = () => {
  const { ui, details } = useStores()
  const theme = useTheme()

  return (
    <>
      <View style={{ ...styles.headerActions }}>
        <View style={styles.wallet}>
          <Typography size={30} fw='500' style={{ marginBottom: 10 }}>
            My Wallet
          </Typography>
          <Typography size={20} fw='400' style={{ marginBottom: 10 }}>
            {moment(new Date()).format('ddd MMM DD, hh:mm A')}
          </Typography>
          <View>
            <Typography size={12} fw='500' textAlign='center' color={theme.subtitle}>
              Total balance
            </Typography>
            <Typography size={18} fw='500'>
              {details?.fullBalance}{' '}
              <Typography color={theme.subtitle} fw='400'>
                {' '}
                sat
              </Typography>
            </Typography>
            {/* <Typography size={17} fw='500'>
              {' '}
              =
            </Typography>
            <Typography
              size={20}
              color={theme.primary}
              fw='500'
              // style={{ marginLeft: 10 }}
            >
              <Typography size={17} color={theme.primary}>
                $
              </Typography>
              {details.usAmount}
            </Typography> */}
          </View>
          <View
            style={{
              marginTop: 14,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Typography
              size={12}
              fw='500'
              textAlign='center'
              color={theme.subtitle}
              style={{ marginBottom: 4 }}
            >
              You can receive
            </Typography>
            <View
              style={{
                backgroundColor: theme.secondary,
                borderRadius: 50,
                height: 30,
                width: 100,
              }}
            >
              <Typography size={16} fw='500' textAlign='center' color={theme.white} lh={30}>
                {details?.remoteBalance}{' '}
              </Typography>
            </View>
          </View>
        </View>

        {/* <MaskedView
          maskElement={
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['transparent', 'black', 'transparent']}
              style={{ flex: 1 }}
            ></LinearGradient>
          }
        >
          <View
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Image
              style={{ width: SCREEN_WIDTH, height: 100 }}
              source={require('../../assets/sparkline.webp')}
            />
          </View>
        </MaskedView> */}

        <View style={styles.buttonWrap}>
          <Button
            icon='arrow-bottom-left'
            w={125}
            h={40}
            round={5}
            style={{ borderColor: theme.border, marginRight: 6 }}
            onPress={() => ui.setPayMode('invoice', null)}
          >
            RECEIVE
          </Button>
          <Button
            color={theme.darkPrimary}
            icon='arrow-top-right'
            w={125}
            h={40}
            round={5}
            style={{ borderColor: theme.border, marginLeft: 6 }}
            onPress={() => ui.setPayMode('payment', null)}
          >
            SEND
          </Button>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  wallet: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 30,
  },
})
