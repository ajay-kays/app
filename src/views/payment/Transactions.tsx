import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { observer } from 'mobx-react-lite'
import { ActivityIndicator } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TabView } from 'react-native-tab-view'
import moment from 'moment'
import { useStores, useTheme } from '../../store'
import Empty from '../common/Empty'
import Icon from '../common/Icon'
import RefreshLoading from '../common/RefreshLoading'
import Typography from '../common/Typography'
import Tabs from '../common/Tabs'
import { Msg } from 'store/msg-store'
import { useMemoizedIncomingPaymentsFromPodcast } from '../../store/hooks/pod'
import { transformPayments } from '../utils/payments/transformPayments'
import { display } from 'lib/logging'

type TransactionsProps = {
  payments: Msg[]
  loading: boolean
  refreshing: boolean
  onRefresh: () => void
  listHeader: React.ReactElement
}

function Transactions({ listHeader, ...props }: TransactionsProps) {
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'first', title: 'All Transactions' },
    { key: 'second', title: 'Per Community' },
  ])

  const renderScene = ({ route: renderSceneRoute }) => {
    switch (renderSceneRoute.key) {
      case 'first':
        return <AllTransactions {...props} />
      case 'second':
        return <PerTribe {...props} />
      default:
        return null
    }
  }

  return (
    <>
      {listHeader}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(p) => <Tabs {...p} />}
      />
    </>
  )
}

export default observer(Transactions)

/**
 * TODO: rename component name and utils to make it match with tab title `Per Community`
 */
type PerTribeProps = {
  payments: Msg[]
  loading: boolean
  refreshing: boolean
  onRefresh: () => void
}

const PerTribeFC = (props: PerTribeProps) => {
  const { payments, refreshing, loading, onRefresh } = props
  const { user, chats } = useStores()

  const renderItem: any = ({ item, index }: any) => (
    <Payment
      key={index}
      shouldSkipFetchOfPodcast={false}
      showTribeName
      showTime={false}
      {...item}
    />
  )

  const tribesSpent = useMemo(() => {
    if (!payments) return []
    return transformPayments({ payments, userId: user.myid, chats })
  }, [payments, chats, user])

  return (
    <View style={styles.wrap}>
      {loading ? (
        <View style={{ paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={tribesSpent}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={<ListEmpty />}
          refreshing={refreshing}
          onRefresh={onRefresh}
          refreshControl={<RefreshLoading refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  )
}
const PerTribe = observer(PerTribeFC)

type AllTransactionsProps = {
  payments: Msg[]
  loading: boolean
  refreshing: boolean
  onRefresh: () => void
}

const AllTransactionsFC = (props: AllTransactionsProps) => {
  const { payments, refreshing, loading, onRefresh } = props

  display({
    name: 'AllTransactions',
    preview: 'Now what is this:',
    value: { payments },
  })

  const renderItem: any = ({ item, index }: any) => <Payment key={index} {...item} />

  return (
    <View style={styles.wrap}>
      {loading ? (
        <View style={{ paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={payments}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={<ListEmpty />}
          refreshing={refreshing}
          onRefresh={onRefresh} // was doubled?
          refreshControl={<RefreshLoading refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  )
}
export const AllTransactions = observer(AllTransactionsFC)

function ListEmpty() {
  return <Empty text='No transactions found' />
}

type PaymentProps = {
  amount: number
  date: string
  sender: number
  chat_id: string
  showTribeName: boolean
  showTime: boolean
  shouldSkipFetchOfPodcast?: boolean
}
function Payment(props: PaymentProps) {
  const { user, contacts, chats } = useStores()
  const theme = useTheme()
  display({
    name: 'Payment',
    preview: 'payment we got what',
    value: { props },
    important: true,
  })
  const {
    amount,
    date,
    sender,
    chat_id,
    showTribeName = false,
    showTime = true,
    shouldSkipFetchOfPodcast = true,
  } = props
  const transactionDate = moment(date).format('dd MMM DD, hh:mm A')
  const [podId, setPodId] = useState<any>(null)

  const chat = useMemo(() => chats.chats.get(chat_id), [chat_id])
  // const chat = useMemo(() => chats.chatsArray.find((c) => c.id.toString() === chat_id), [])
  display({
    name: 'Payment',
    preview: 'whatS THIS',
    important: true,
    value: { chat },
  })

  // TODO: check if is necessary to move it to <PerTribe/>
  useEffect(() => {
    // skip fetch podcast is the default as seen we
    // just only this occur in `<PerTribe/>`
    if (shouldSkipFetchOfPodcast) {
      return // skip
    }
    ;(async () => {
      if (!chat) return // ?
      const tr = await chats.getTribeDetails(chat.host, chat.uuid)
      const params = await chats.loadFeed(chat.host, chat.uuid, tr.feed_url)
      if (params) setPodId(params.id)
    })()
  }, [])

  const type = useMemo(() => (sender === user.myid ? 'payment' : 'invoice'), [sender, user.myid])
  const params = {
    payment: {
      icon: 'arrow-top-right',
      color: '#FFA292',
      background: theme.bg,
    },
    invoice: {
      icon: 'arrow-bottom-left',
      color: '#94C4FF',
      background: theme.main,
    },
  }

  const text = useMemo(() => {
    if (type !== 'payment') {
      const contact = contacts.contactsArray.find((c) => c.id === sender)
      return contact ? contact.alias || contact.public_key : 'Unknown'
    }

    // console.log('chat:', chat)
    // console.log('chat.name:', chat?.name)

    if (chat?.name && showTribeName) return chat.name
    if (chat?.contact_ids?.length !== 2) {
      console.log(
        `returning dash cuz donno CONTACTIDs for id ${chat?.id} - showTribeName is ${showTribeName}`,
        chat?.name
      )
      console.log('contactids:', chat?.contact_ids)
      return '-'
    }

    const oid = chat.contact_ids.find((id) => id !== user.myid)
    const contact = contacts.contactsArray.find((c) => c.id === oid)

    display({
      name: 'transaction',
      value: { oid, contact, chat },
      important: true,
    })

    if (contact) return contact.alias || contact.public_key
    console.log('so dash')
    return '-'
  }, [contacts, chats, user, type])
  const { earned, spent } = useMemoizedIncomingPaymentsFromPodcast(podId, user.myid)
  const p = params[type]
  console.log('TEXT:', text)
  return (
    <View style={{ backgroundColor: p.background }}>
      <View style={{ ...styles.paymentBox, borderBottomColor: theme.border }}>
        <View style={{ ...styles.payment }}>
          <MaterialCommunityIcon
            name={p.icon}
            color={p.color}
            size={28}
            style={{ marginLeft: 10 }}
          />
          <View style={styles.mid}>
            <Icon name='Invoice' fill={theme.icon} size={14} />
            <Typography style={{ marginLeft: 10 }} numberOfLines={1}>
              {text}
            </Typography>
          </View>
          <View style={styles.amountWrap}>
            <Typography
              size={14}
              style={{
                marginRight: 10,
              }}
            >
              {/* `spent` is > 0 if only if `earned` = 0 */}
              {/* `earned` is > 0 if only if `spent` = 0 */}
              {amount + spent + earned}
            </Typography>
            <Typography fw='600' color={theme.subtitle}>
              sat
            </Typography>
          </View>
        </View>
        {showTime && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Typography color={theme.subtitle} size={12}>
              {transactionDate}
            </Typography>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  title: {
    paddingBottom: 14,
    paddingLeft: 14,
    fontSize: 24,
  },
  paymentBox: {
    height: 70,
    maxHeight: 70,
    minHeight: 70,
    paddingTop: 14,
    paddingRight: 14,
    borderBottomWidth: 1,
  },
  payment: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  mid: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  loading: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    marginTop: 40,
  },
  amountWrap: {
    marginLeft: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contact: {},
})
