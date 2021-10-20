import React, { useEffect, useState } from 'react'
import { RootStore, RootStoreProvider, setupRootStore } from 'store'
import { HomePlaceholder } from 'views/home-placeholder'

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
      <HomePlaceholder />
    </RootStoreProvider>
  )
}

export default App
