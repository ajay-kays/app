import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import codePush from 'react-native-code-push'
import Bugsnag from '@bugsnag/react-native'
import { RootStore, RootStoreProvider, setupRootStore } from 'store'
import { navigationRef } from 'nav'
import Splash from 'views/common/Splash'
import { ErrorSimple } from 'views/error/error-simple'
import { RootComponent } from './root-component'

Bugsnag.start()
const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)

const App = () => {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      const root = await setupRootStore()
      setRootStore(root)
    })()
  }, [])

  if (!rootStore) return <Splash />

  return (
    <ErrorBoundary FallbackComponent={ErrorSimple}>
      <RootStoreProvider value={rootStore}>
        <NavigationContainer ref={navigationRef}>
          <RootComponent />
        </NavigationContainer>
      </RootStoreProvider>
    </ErrorBoundary>
  )
}

export default codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME })(App)
