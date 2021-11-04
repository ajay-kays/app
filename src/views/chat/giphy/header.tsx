import React from 'react'
import { View } from 'react-native'
import { TextInput } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTheme } from 'store'
import { GiphyProps } from './type'
import styles from './styles'

type HeaderProps = Pick<GiphyProps, 'onClose' | 'searchGif' | 'setSearchGif' | 'getGifsBySearch'>

const Header: React.FC<HeaderProps> = ({ onClose, searchGif, setSearchGif, getGifsBySearch }) => {
  const theme = useTheme()

  return (
    <View style={styles.header}>
      <View style={styles.inputContainer}>
        <TextInput
          autoCompleteType='off'
          style={{
            ...styles.input,
            backgroundColor: theme.inputBg,
            color: theme.input,
          }}
          placeholder='Search on GIPHY'
          value={searchGif}
          onChangeText={setSearchGif}
          onSubmitEditing={(v) => {
            if (!searchGif) return
            getGifsBySearch()
          }}
          underlineColor='transparent'
          left={
            // @ts-ignore - same tvparallax crap
            <TextInput.Icon
              name={() => <Ionicons name='search' size={20} color={theme.primary} />}
            />
          }
        />
      </View>
    </View>
  )
}

export default Header
