import React from 'react'
import MasonryList from '@react-native-seoul/masonry-list'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import { useKeyboard } from '@react-native-community/hooks'
import { ActivityIndicator } from 'react-native-paper'
import { useTheme } from 'store'
import { GiphyProps } from './type'
import styles from './styles'
import Header from './header'
import Footer from './footer'
import Item from './item'

/**
 * Component that shows a modal with specific gifs
 * @param {boolean} open - param that handle if the modal is open or not
 * @param {Function} onClose - Function that close the modal
 * @param {Array<Object>} gifs - array with all the gifs
 * @param {String} searchGif - param that have the value of wich of gifs search
 * @param {Function} setSearchGif - callback function that return the text value to search
 * @param {Function} onSendGifHandler - callback function that return the selected gif
 * @param {Function} onSubmitEditing - function that search the type of gifs
 * @param {Function} isSearchCompleted - boolean to show loader while data is being fetched
 */
const Giphy = React.forwardRef<Modalize | null, GiphyProps>(
  (
    { gifs, open, onClose, searchGif, onSendGifHandler, setSearchGif, getGifsBySearch, isSearchCompleted },
    modalizeRef
  ) => {
    const { keyboardHeight } = useKeyboard()
    const modalHeight = keyboardHeight + 100
    const theme = useTheme()

    const onSearchGIF = () => {
      setSearchGif(searchGif)
      getGifsBySearch()
    }

    const CustomHeader = () => (
      <Header
        onClose={onClose}
        searchGif={searchGif}
        setSearchGif={setSearchGif}
        getGifsBySearch={getGifsBySearch}
      />
    )

    return (
      <Portal>
        <Modalize
          ref={modalizeRef}
          modalHeight={Math.max(modalHeight, 450)}
          HeaderComponent={CustomHeader}
          FooterComponent={Footer}
          modalStyle={{ backgroundColor: theme.main }}
        >
          {
            isSearchCompleted && gifs?.length ? <MasonryList
              contentContainerStyle={styles.mansoryContainer}
              numColumns={3}
              data={gifs}
              renderItem={Item(onSendGifHandler)}
            /> : <ActivityIndicator />
          }

        </Modalize>
      </Portal>
    )
  }
)

export default Giphy
