import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { RootStore, RootStoreProvider, setupRootStore } from 'store'
import { navigationRef } from 'nav'
import { RootComponent } from './root-component'

const App = () => {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      const root = await setupRootStore()
      setRootStore(root)
    })()
  }, [])

  if (!rootStore) return null

  return (
    <RootStoreProvider value={rootStore}>
      <NavigationContainer ref={navigationRef}>
        <RootComponent />
      </NavigationContainer>
    </RootStoreProvider>
  )
}

export default App
