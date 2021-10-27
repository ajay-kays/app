import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider as PaperProvider } from 'react-native-paper'
import { RootStore, RootStoreProvider, setupRootStore } from 'store'
import { navigationRef, RootNavigator } from './nav'
import { paperTheme } from './theme'

const App = () => {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      setupRootStore().then(setRootStore)
    })()
  }, [])

  if (!rootStore) return null

  const pTheme = paperTheme(rootStore.theme)

  return (
    <RootStoreProvider value={rootStore}>
      <PaperProvider theme={pTheme}>
        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </RootStoreProvider>
  )
}

export default App
