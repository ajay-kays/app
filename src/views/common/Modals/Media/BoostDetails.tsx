import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useStores, useTheme } from '../../../../store'
import { useBoostSender } from '../../../../store/hooks/msg'
import CustomIcon from 'lib/customIcons'
import Typography from '../../../common/Typography'
import AvatarsRow from '../../../chat/msg/avatarsRow'

export default function BoostRow(props) {
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

  const hasBoosts = theBoosts ? true : false

  return (
    <View style={{ ...styles.wrap }}>
      <View style={{ ...styles.left, paddingRight: 8 }}>
        <View style={{ ...styles.rocketWrap, backgroundColor: theme.primary }}>
          <CustomIcon color='white' size={15} name='fireworks' />
        </View>
        <Typography color={theme.white} style={{ marginHorizontal: 10 }}>
          {props.boosts_total_sats}
        </Typography>
        <Typography color={theme.white}>sats</Typography>
      </View>
      <View style={{ ...styles.right }}>
        {hasBoosts && (
          <AvatarsRow
            aliases={theBoosts.map((b) => {
              const { senderAlias, senderPic } = useBoostSender(b, contacts.contacts, true)

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
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 4,
  },
  rocketWrap: {
    height: 17,
    width: 17,
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
