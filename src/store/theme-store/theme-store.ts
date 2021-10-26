import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withEnvironment } from '../extensions/with-environment'

type Mode = 'System' | 'Dark' | 'Light'
export const ThemeStoreModel = types
  .model('ThemeStore')
  .props({
    dark: types.optional(types.boolean, false),
    mode: types.optional(types.string, 'System'),

    bg: types.optional(types.string, '#fff'),
    main: types.optional(types.string, '#f8fafb'),
    title: types.optional(types.string, '#666'),
    subtitle: types.optional(types.string, '#7e7e7e'),
    text: types.optional(types.string, '#000000'),
    typo: types.optional(types.string, '#212529'),
    icon: types.optional(types.string, '#65676b'),
    iconPrimary: types.optional(types.string, '#000000'),
    input: types.optional(types.string, '#000000'),
    inputBg: types.optional(types.string, '#f0f2f5'),
    placeholder: types.optional(types.string, '#90949c'),
    border: types.optional(types.string, '#f0f2f5'),
    selected: types.optional(types.string, '#0067ff'),
    deep: types.optional(types.string, '#ccc'),
    primary: types.optional(types.string, '#0067ff'),
    secondary: types.optional(types.string, '#0fb17d'),
    darkPrimary: types.optional(types.string, '#153567'),
    special: types.optional(types.string, '#f8fafb'),

    white: types.optional(types.string, '#fff'),
    lightGrey: types.optional(types.string, '#f5f6f8'),
    grey: types.optional(types.string, '#d0d0d0'),
    darkGrey: types.optional(types.string, '#777'),
    greyPrimary: types.optional(types.string, '#aaa'),
    greySecondary: types.optional(types.string, '#c7c9c6'),
    greySpecial: types.optional(types.string, '#5c6370'),
    black: types.optional(types.string, '#000000'),
    gradient: types.optional(types.string, '#4889e8'),
    gradient2: types.optional(types.string, '#055deb'),
    disabled: types.optional(types.string, '#d9dce0'),
    clay: types.optional(types.string, '#212932'),
    blue: types.optional(types.string, '#0067ff'),
    red: types.optional(types.string, '#f50057'),
    green: types.optional(types.string, '#25D366'),
    mirage: types.optional(types.string, '#141d26'),
    yellow: types.optional(types.string, '#FFDF00'),
    silver: types.optional(types.string, '#afb3b1'),
    purple: types.optional(types.string, '#6289FD'),
    orange: types.optional(types.string, '#f0665b'),
    orangeSecondary: types.optional(types.string, '#e45e53'),

    badge: types.optional(types.string, '#f50057'),
    accent: types.optional(types.string, '#0a84ff'),
    active: types.optional(types.string, '#49ca97'),
    inactive: types.optional(types.string, '#febd59'),
    error: types.optional(types.string, '#ff0033'),
    transparent: types.optional(types.string, 'rgba(0,0,0,0.5)'),
    danger: types.optional(types.string, '#fa1616'),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    setMode: (m: Mode) => {
      self.mode = m
    },
    setDark: (dark: boolean) => {
      self.dark = dark
      self.bg = dark ? '#141d26' : '#fff'
      self.main = dark ? '#1c252e' : '#f8fafb'
      self.title = dark ? '#ddd' : '#666'
      self.subtitle = dark ? '#8b98b4' : '#7e7e7e'
      self.text = dark ? '#fff' : '#000000'
      self.icon = dark ? '#f3f3f3' : '#65676b'
      self.iconPrimary = dark ? '#fff' : '#000000'
      self.input = dark ? '#fff' : '#000000'
      self.inputBg = dark ? '#1c252e' : '#f0f2f5'
      self.placeholder = dark ? '#8b98b4' : '#90949c'
      self.border = dark ? '#212e39' : '#f0f2f5'
      self.selected = dark ? '#0067ff' : '#0067ff'
      self.deep = dark ? '#292c33' : '#ccc'
      self.primary = dark ? '#0067ff' : '#0067ff'
      self.secondary = dark ? '#0fb17d' : '#0fb17d'
      self.special = dark ? '#1c252e' : '#f8fafb'
    },
  }))

type ThemeStoreType = Instance<typeof ThemeStoreModel>
export interface ThemeStore extends ThemeStoreType {}
type ThemeStoreSnapshotType = SnapshotOut<typeof ThemeStoreModel>
export interface ThemeStoreSnapshot extends ThemeStoreSnapshotType {}
export const createThemeStoreDefaultModel = () => types.optional(ThemeStoreModel, {})
