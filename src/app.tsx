import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { RootStore, RootStoreProvider, setupRootStore } from 'store'
import { HomePlaceholder } from 'views/home-placeholder'
import { RootNavigator } from './nav'

const App = () => {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      setupRootStore().then(setRootStore)
    })()
  }, [])

  if (!rootStore) return null

  return (
    <RootStoreProvider value={rootStore}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </RootStoreProvider>
  )
}

export default App
