import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useStores, useTheme } from '../../../store'
import { useBoostSender } from '../../../store/hooks/msg'
import CustomIcon from 'lib/customIcons'
import shared from './sharedStyles'
import Typography from '../../common/Typography'
import AvatarsRow from './avatarsRow'

export default function BoostRow({ isTribe = true, ...props }) {
  const { contacts } = useStores()
  const theme = useTheme()
  const isMe = props.sender === props.myid

  const theBoosts: any[] = []
  if (props.boosts) {
    props.boosts.forEach((b) => {
      if (
        !theBoosts.find((bb) => (bb.sender_alias || bb.sender) === (b.sender_alias || b.sender))
      ) {
        theBoosts.push(b)
      }
    })
  }

  const paddStyles = props.pad
    ? {
        ...shared.innerPad,
        ...(props.customPad && props.customPad),
      }
    : {}

  const wrapStyles = {
    ...styles.row,
    maxWidth: '100%',
    height: props.pad ? 50 : 35,
    ...paddStyles,
  }

  const hasBoosts = theBoosts ? true : false

  return (
    <View style={wrapStyles}>
      <View style={{ ...styles.left, marginRight: 18 }}>
        <View style={{ ...styles.rocketWrap, backgroundColor: theme.primary }}>
          <CustomIcon color='white' size={15} name='fireworks' />
        </View>
        <Typography color={theme.text} style={{ ...styles.amt }}>
          {props.boosts_total_sats}
        </Typography>
        <Typography color={theme.subtitle} style={{ ...styles.sats }}>
          sats
        </Typography>
      </View>
      <View style={{ ...styles.right }}>
        {hasBoosts && (
          <AvatarsRow
            aliases={theBoosts.map((b) => {
              const { senderAlias, senderPic } = useBoostSender(b, contacts.contacts, isTribe)

              if (b.sender === props.myid) {
                return {
                  alias: props.myAlias || 'Me',
                  photo: props.myPhoto,
                }
              }

              return {
                alias: senderAlias,
                photo: senderPic,
              }
            })}
            borderColor={theme.border}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 35,
  },
  left: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 99,
  },
  right: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rocketWrap: {
    height: 17,
    width: 17,
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amt: {
    marginLeft: 6,
    fontSize: 10,
  },
  sats: {
    marginLeft: 4,
    fontSize: 10,
  },
})
