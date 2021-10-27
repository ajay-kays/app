import { DefaultTheme, configureFonts } from 'react-native-paper'
import { Font } from 'lib/types'

const fontConfig = {
  default: {
    regular: <Font>{
      fontFamily: 'Proxima Nova Regular',
      fontWeight: '400',
    },
    medium: <Font>{
      fontFamily: 'Proxima Nova Regular',
      fontWeight: '400',
    },
    light: <Font>{
      fontFamily: 'Proxima Nova Regular',
      fontWeight: '400',
    },
    thin: <Font>{
      fontFamily: 'Proxima Nova Regular',
      fontWeight: '400',
    },
  },
}

export function paperTheme(theme) {
  return {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.primary,
      accent: theme.accent,
      text: theme.text,
      placeholder: theme.placeholder,
      background: theme.bg,
      surface: theme.main,
      error: theme.error,
    },
    dark: theme.dark,
  }
}
// fontFamily: 'Icomoon'
