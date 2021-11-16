import React, { useMemo } from 'react'
import { StyleSheet, View, TouchableOpacity, Alert, Linking } from 'react-native'
import RNUrlPreview from 'react-native-url-preview'
import Hyperlink from 'react-native-hyperlink'
import * as linkify from 'linkifyjs'

import { useTheme } from '../../../store'
import shared from './sharedStyles'
import ClipMessage from './clipMsg'
import BoostMessage from './boostMsg'
import BoostRow from './boostRow'
import CommunityMsg from './communityMsg'
import EmbedVideo from './embedVideo'
import Typography from '../../common/Typography'
import { getRumbleLink, getYoutubeLink, verifyPubKey, verifyCommunity } from './utils'
import PubkeyMessage from './pubMsg'
import GiphMessage from './giphMsg'

export default function TextMsg(props) {
  const theme = useTheme()

  const { message_content, isTribe } = props
  const rumbleLink = useMemo(() => getRumbleLink(message_content), [message_content])
  const youtubeLink = useMemo(() => getYoutubeLink(message_content), [message_content])
  const showBoostRow = props.boosts_total_sats ? true : false
  const isGiphy = message_content && message_content.startsWith('giphy::')
  const isClip = message_content && message_content.startsWith('clip::')
  const isBoost = message_content?.startsWith('boost::')
  const isLink = linkify.find(message_content, 'url').length > 0
  const { isPubKey, pubKey } = verifyPubKey(message_content)
  const isCommunity = verifyCommunity(message_content)

  const onLongPressHandler = () => props.onLongPress(props)

  /**
   * Returns
   */
  if (isGiphy) {
    return (
      <GiphMessage {...props} showBoostRow={showBoostRow} onLongPressHandler={onLongPressHandler} />
    )
  }
  if (isClip)
    return (
      <ClipMessage {...props} showBoostRow={showBoostRow} onLongPressHandler={onLongPressHandler} />
    )
  if (isBoost) return <BoostMessage {...props} />
  if (rumbleLink || youtubeLink)
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={isLink ? { width: 280, minHeight: 72 } : shared.innerPad}
        onLongPress={onLongPressHandler}
      >
        {/* TODO: Refactor with a better logic */}
        {!!rumbleLink && (
          <EmbedVideo type='rumble' link={rumbleLink} onLongPress={onLongPressHandler} />
        )}
        {!!youtubeLink && (
          <EmbedVideo type='youtube' link={youtubeLink} onLongPress={onLongPressHandler} />
        )}
        {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} pad />}
      </TouchableOpacity>
    )

  if (isPubKey) {
    return (
      <PubkeyMessage
        {...props}
        pubKey={pubKey}
        showBoostRow={showBoostRow}
        onLongPressHandler={onLongPressHandler}
      />
    )
  }

  if (isCommunity) {
    return (
      <CommunityMsg
        {...props}
        showBoostRow={showBoostRow}
        onLongPressHandler={onLongPressHandler}
      />
    )
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={isLink ? { width: 280, minHeight: 72, ...shared.innerPad } : shared.innerPad}
      onLongPress={onLongPressHandler}
    >
      {isLink ? (
        <View style={styles.linkWrap}>
          <Hyperlink
            linkStyle={{ color: theme.blue }}
            onPress={(url) => {
              Alert.alert('Warning', 'Link may contain harmful content, wanna continue?', [
                { text: 'No', onPress: () => {} },
                { text: 'Yes', onPress: () => Linking.openURL(url) },
              ])
            }}
          >
            <Typography color={theme.text} size={15}>
              {message_content}
            </Typography>
          </Hyperlink>
          <RNUrlPreview {...linkStyles(theme)} text={message_content} />
        </View>
      ) : (
        <Typography color={theme.text} size={15}>
          {message_content}
        </Typography>
      )}
      {showBoostRow && (
        <BoostRow
          {...props}
          isTribe={isTribe}
          myAlias={props.myAlias}
          {...(isLink && {
            pad: true,
            customPad: {
              paddingLeft: 10,
              paddingRight: 20,
              paddingTop: 0,
              paddingBottom: 0,
            },
          })}
        />
      )}
    </TouchableOpacity>
  )
}

function linkStyles(theme) {
  return {
    containerStyle: {
      alignItems: 'center',
    },
    imageStyle: {
      width: 80,
      height: 80,
      paddingRight: 10,
      paddingLeft: 10,
    },
    titleStyle: {
      fontSize: 14,
      color: theme.title,
      marginRight: 10,
      marginBottom: 5,
      alignSelf: 'flex-start',
      fontFamily: 'Helvetica',
    },
    descriptionStyle: {
      fontSize: 11,
      color: theme.subtitle,
      marginRight: 10,
      alignSelf: 'flex-start',
      fontFamily: 'Helvetica',
    },
  }
}

const styles = StyleSheet.create({
  linkWrap: {
    display: 'flex',
  },
})
