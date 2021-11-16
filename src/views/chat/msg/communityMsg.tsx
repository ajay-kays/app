/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import { useTheme, useStores } from '../../../store'
import { extractURLSearchParams } from 'lib/utils'
import shared from './sharedStyles'
import Typography from '../../common/Typography'
import Avatar from '../../common/Avatar'
import Button from '../../common/Button'
import JoinCommunity from '../../common/Modals/Community/JoinCommunity'
import BoostRow from './boostRow'

interface Community {
  name: string
  description: string
  img: string
  uuid: string
  host?: string
}

export default function TribeMessage(props) {
  const theme = useTheme()
  const { chats } = useStores()
  const [community, setCommunity] = useState<Community>() as any
  const [error, setError] = useState('Could not load community...')
  const [loading, setLoading] = useState(true)
  const [showJoinButton, setShowJoinButton] = useState<boolean>(false)
  const [joinTribe, setJoinTribe] = useState({ visible: false, community: null })

  useEffect(() => {
    loadCommunity()
  }, [])

  async function loadCommunity() {
    const p = extractURLSearchParams(props.message_content)

    const communityParams = await chats.getTribeDetails(p['host'], p['uuid'])
    if (communityParams) {
      setCommunity(communityParams)
    } else {
      setError('Could not load community...')
    }

    if (communityParams) {
      const AJ = chats.chatsArray.find((c) => c.uuid === communityParams.uuid)
      if (!AJ) setShowJoinButton(true)
    }
    setLoading(false)
  }

  function seeCommunity() {
    if (showJoinButton) {
      setJoinTribe({
        visible: true,
        community,
      })
    } else {
      setJoinTribe({
        visible: true,
        community,
      })
    }
  }

  if (loading)
    return (
      <View style={styles.wrap}>
        <ActivityIndicator size='small' />
      </View>
    )
  if (!(community && community.uuid))
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={shared.innerPad}
        onLongPress={props.onLongPressHandler}
      >
        <Typography color={theme.purple}>{error}</Typography>
      </TouchableOpacity>
    )
  const hasImg = community.img ? true : false
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={shared.innerPad}
        onLongPress={props.onLongPressHandler}
      >
        <Typography style={{ marginBottom: 10 }}>{props.message_content}</Typography>

        <View style={styles.tribeWrap}>
          <Avatar photo={hasImg && community.img} size={40} round={90} />
          <View style={styles.tribeText}>
            <Typography style={{ ...styles.tribeName }} numberOfLines={1}>
              {community.name}
            </Typography>
            <Typography color={theme.subtitle} numberOfLines={2}>
              {community.description}
            </Typography>
          </View>
        </View>

        <Button
          onPress={seeCommunity}
          accessibilityLabel='see-community-button'
          ph={15}
          h={40}
          fs={12}
          round={5}
          style={{ width: '100%', marginTop: 12 }}
        >
          {showJoinButton ? 'Join Community' : 'View Community'}
        </Button>

        {props.showBoostRow && (
          <View style={{ marginTop: 8 }}>
            <BoostRow {...props} myAlias={props.myAlias} />
          </View>
        )}
      </TouchableOpacity>

      <JoinCommunity
        visible={joinTribe.visible}
        tribe={joinTribe.community}
        close={() => {
          setJoinTribe({
            visible: false,
            community: null,
          })
        }}
      />
    </>
  )
}
const styles = StyleSheet.create({
  wrap: {
    padding: 16,
    maxWidth: 440,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  tribeWrap: {
    display: 'flex',
    flexDirection: 'row',
  },
  tribeText: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 8,
    // maxWidth: 160,
    flex: 1,
  },
  tribeName: {
    marginBottom: 5,
  },
})
