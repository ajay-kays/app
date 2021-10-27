import React from 'react'
import { RouteProp } from '@react-navigation/core'
import { Chat } from 'store/chats-store'
import AuthNavigator from './auth-navigator'

export { AuthNavigator }

export * from './root-navigator'

export const navigationRef = React.createRef<any>()

export function navigate(name: string, params: any = {}) {
  navigationRef.current?.navigate(name, params)
}

export type DashStackParamList = {
  Home: undefined
  Chat: Chat
}

export type ChatRouteProp = RouteProp<DashStackParamList, 'Chat'>
