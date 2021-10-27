declare module 'base-64'
declare module 'react-native-rncryptor'

declare module '*.svg' {
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<SvgProps>
}
