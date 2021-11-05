import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useNavigation, useRoute } from '@react-navigation/native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import IonIcon from 'react-native-vector-icons/Ionicons'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons'
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import { useTheme } from 'store'
import Pushable from '../Pushable'
import Icon from '../Icon'

function TabBar() {
  const theme = useTheme()
  const navigation = useNavigation()
  const current = useRoute()
  const { width } = Dimensions.get('window')
  const tabbarWidth = width - 32

  const routes = [
    {
      name: 'Chats',
      icon: (color) => <IonIcon name='chatbubbles-outline' color={color} size={24} />,
      key: 'chats',
    },
    {
      name: 'Communities',
      icon: (color) => <FontAwesome5Icon name='users' color={color} size={20} />,
      key: 'communities',
    },
    {
      name: 'Payment',
      icon: (color) => <SimpleIcon name='wallet' color={color} size={20} />,
      key: 'payment',
    },
    {
      name: 'Account',
      icon: 'account',
      key: 'account',
    },
  ]

  return (
    <View
      style={{
        ...styles.wrap,
        backgroundColor: theme.bg,
        borderTopColor: theme.border,
      }}
    >
      <View style={{ ...styles.tabBar }}>
        {routes.map((route) => {
          return (
            <Pushable
              key={route.key}
              onPress={() => {
                navigation.navigate(route.name as never)
              }}
            >
              <View
                style={{
                  ...styles.iconWrap,
                  width: tabbarWidth / 4,
                }}
              >
                {renderIcon(route, current, theme)}
              </View>
            </Pushable>
          )
        })}
      </View>
    </View>
  )
}

export default observer(TabBar)

function renderIcon(route, current, theme) {
  const iconElement = typeof route.icon === 'function'
  return (
    <>
      {iconElement ? (
        <>{route.icon(route.name === current.name ? theme.primary : theme.icon)}</>
      ) : (
        <Icon
          name={route.name}
          color={
            route.name === current.name || `${route.name}Main` === current.name
              ? theme.primary
              : theme.icon
          }
          size={24}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    height: isIphoneX() ? 50 + getBottomSpace() : 60,
  },
  iconWrap: {
    height: isIphoneX() ? 50 + getBottomSpace() : 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIndicatorWrap: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
  },
  tabIndicator: {
    height: 4,
    borderRadius: 2,
    width: '50%',
  },
})
