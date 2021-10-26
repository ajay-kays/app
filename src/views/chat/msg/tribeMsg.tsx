import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { ActivityIndicator, Button } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'

import { useTheme, useStores } from '../../../store'
import { DEFAULT_TRIBE_SERVER } from 'lib/config'
import { reportError } from 'lib/errorHelper'

interface Tribe {
  name: string
  description: string
  img: string
  uuid: string
  host?: string
}

export default function TribeMessage(props) {
  const theme = useTheme()
  const { ui, chats } = useStores()
  const [tribe, setTribe] = useState<Tribe>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showJoinButton, setShowJoinButton] = useState<boolean>(false)

  const navigation = useNavigation()

  async function loadTribe() {
    const p = extractURLSearchParams(props.message_content)
    const tribeParams = await getTribeDetails(p['host'], p['uuid'])
    if (tribeParams) {
      setTribe(tribeParams)
    } else {
      setError('Could not load Tribe.')
    }
    if (tribeParams) {
      const AJ = chats.chatsArray.find((c) => c.uuid === tribeParams.uuid)
      if (!AJ) setShowJoinButton(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadTribe()
  }, [])

  function seeTribe() {
    // ui.setJoinTribeModal(true, tribe)
    navigation.navigate('Home' as never, { params: { rnd: Math.random() } } as never)
  }

  if (loading)
    return (
      <View style={styles.wrap}>
        <ActivityIndicator animating={true} color={theme.subtitle} />
      </View>
    )
  if (!(tribe && tribe.uuid)) return <View style={styles.wrap}>Could not load tribe...</View>

  const hasImg = tribe.img ? true : false
  return (
    <View style={{ ...styles.wrap }}>
      <View style={styles.tribeWrap}>
        <FastImage
          source={hasImg ? { uri: tribe.img } : require('../../../../android_assets/tent.png')}
          resizeMode={FastImage.resizeMode.cover}
          style={{ width: 70, height: 70, flexShrink: 0, minWidth: 75 }}
        />
        <View style={styles.tribeText}>
          <Text style={{ ...styles.tribeName, color: theme.title }} numberOfLines={1}>
            {tribe.name}
          </Text>
          <Text style={{ ...styles.tribeDescription, color: theme.subtitle }} numberOfLines={2}>
            {tribe.description}
          </Text>
        </View>
      </View>
      {showJoinButton && (
        <Button
          mode='contained'
          icon='arrow-right'
          onPress={seeTribe}
          accessibilityLabel='see-tribe-button'
          style={{ width: '100%', marginTop: 12 }}
        >
          See Tribe
        </Button>
      )}
    </View>
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
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tribeText: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 8,
    maxWidth: 160,
  },
  tribeName: {
    fontSize: 16,
    marginBottom: 5,
  },
  tribeDescription: {
    fontSize: 14,
  },
})

async function getTribeDetails(host: string, uuid: string) {
  if (!host || !uuid) return
  const theHost = host.includes('localhost') ? DEFAULT_TRIBE_SERVER : host
  try {
    const r = await fetch(`https://${theHost}/tribes/${uuid}`)
    const j = await r.json()
    if (j.bots) {
      try {
        const bots = JSON.parse(j.bots)
        j.bots = bots
      } catch (e) {
        j.bots = []
        reportError(e)
      }
    }
    return j
  } catch (e) {
    reportError(e)
  }
}

function extractURLSearchParams(url: string) {
  let regex = /[?&]([^=#]+)=([^&#]*)/g
  let match
  let params = {}
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2]
  }
  return params
}
