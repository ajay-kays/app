import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useTheme, useStores } from '../../../store'
import { SCREEN_WIDTH } from 'lib/constants'
import shared from './sharedStyles'
import Typography from '../../common/Typography'
import Avatar from '../../common/Avatar'
import Button from '../../common/Button'
import BoostRow from './boostRow'

export default function PubkeyMessage(props) {
  const {
    isMe,
    pubKey,
    myAlias,
    senderPic,
    senderAlias,
    message_content,
    isTribe,
    showBoostRow,
    onLongPressHandler,
  } = props
  const theme = useTheme()
  const { ui, contacts } = useStores()

  const alias = isMe ? myAlias : senderAlias
  const isContact = contacts.contactsArray.find((c) => c.public_key === pubKey && !c.from_group)

  return (
    <TouchableOpacity activeOpacity={0.8} style={shared.innerPad} onLongPress={onLongPressHandler}>
      <Typography color={theme.purple} size={15}>
        {message_content}
      </Typography>

      <View style={{ ...styles.pubKeyWrap }}>
        <View style={{ width: '15%' }}>
          <Avatar alias={alias} photo={senderPic} size={30} aliasSize={16} />
        </View>
        <View style={{ ...styles.pubKeyContent, width: '85%' }}>
          <Typography>{alias}</Typography>
          <View style={{ ...styles.pubKey }}>
            <Typography
              color={theme.greySpecial}
              numberOfLines={1}
              style={{
                maxWidth: SCREEN_WIDTH - 220,
                paddingRight: 16,
              }}
            >
              {pubKey}
            </Typography>
            <MaterialIcon name='qrcode' size={22} color={theme.icon} />
          </View>
        </View>
      </View>

      {!isMe && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
          <Button
            size='small'
            w={'100%'}
            round={5}
            onPress={() =>
              ui.setAddContactModal(true, {
                alias: senderAlias,
                public_key: pubKey,
              })
            }
          >
            {isContact ? 'View Contact' : 'Add Contact'}
          </Button>
        </View>
      )}

      {showBoostRow && <BoostRow {...props} isTribe={isTribe} myAlias={props.myAlias} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  pubKeyWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  pubKeyContent: {
    paddingHorizontal: 14,
  },
  pubKey: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
