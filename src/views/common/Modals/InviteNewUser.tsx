import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useStores, useTheme } from 'store'
import * as schemas from '../../form/schemas'
import Form from '../../form'
import ModalWrap from './ModalWrap'
import ModalHeader from './ModalHeader'
import Typography from '../Typography'

export default function InviteNewUser() {
  const [price, setPrice] = useState(null)
  const [loading, setLoading] = useState(false)
  const { ui, contacts } = useStores()
  const theme = useTheme()

  async function invite(values) {
    setLoading(true)
    await contacts.createInvite(values.nickname, values.welcome_message)
    setLoading(false)
    close()
  }

  useEffect(() => {
    fetchPrice()
  }, [])

  async function fetchPrice() {
    const price = await contacts.getLowestPriceForInvite()
    if (price || price === 0) setPrice(price)
  }

  function close() {
    ui.setInviteFriendModal(false)
  }

  const hasPrice = price || price === 0

  const RowContent = (
    <>
      {hasPrice && (
        <View style={styles.estimatedCost}>
          <Typography color={theme.title} fw='500' style={{ ...styles.estimatedCostText }}>
            ESTIMATED COST
          </Typography>
          <View style={styles.estimatedCostBottom}>
            <Typography style={{ ...styles.estimatedCostNum }}>{price}</Typography>
            <Typography color={theme.darkGrey}>sat</Typography>
          </View>
        </View>
      )}
    </>
  )

  return useObserver(() => (
    <ModalWrap onClose={close} visible={ui.inviteFriendModal} noSwipe>
      <ModalHeader title='Add Friend' onClose={close} />
      <View style={styles.content}>
        <Form
          schema={schemas.inviteFriend}
          loading={loading}
          buttonText='Create Invitation'
          btnColor={theme.secondary}
          btnSize='large'
          btnFs={12}
          btnW='50%'
          actionType='Row'
          rowContent={RowContent}
          onSubmit={(values) => invite(values)}
        />
      </View>
    </ModalWrap>
  ))
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  estimatedCost: {
    flexDirection: 'column',
  },
  estimatedCostText: {
    fontSize: 10,
    color: '#aaa',
  },
  estimatedCostBottom: {
    flexDirection: 'row',
  },
  estimatedCostNum: {
    marginRight: 5,
  },
})
