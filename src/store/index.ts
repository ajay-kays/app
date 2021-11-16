import { applySnapshot } from 'mobx-state-tree'
import { useStores } from './root-store/root-store-context'

export * from './hooks'
export * from './extensions/with-environment'
export * from './extensions/with-root-store'
export * from './root-store/root-store'
export * from './root-store/root-store-context'
export * from './root-store/setup-root-store'

export const useTheme = () => useStores().theme

export const reset = (self) => {
  applySnapshot(self, {})
}
