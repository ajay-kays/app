import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  header: {
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  inputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  input: {
    borderBottomColor: 'transparent',
    fontSize: 20,
  },
  mansoryContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 10,
  },
  gifContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  gifWrapper: {
    padding: 3,
  },
  gif: {
    borderRadius: 4,
  },
  loadingWrapper: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
