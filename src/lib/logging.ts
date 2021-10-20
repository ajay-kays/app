// import Bugsnag from '@bugsnag/react-native'

export const log = (...props: any) => {
  // @ts-ignore
  __DEV__ && console.tron.log(props)
  // Bugsnag.leaveBreadcrumb('Log', { value: JSON.stringify(props) })
}

export const display = (props: any) => {
  if (__DEV__) {
    console.tron.display(props)
  }
  // Bugsnag.leaveBreadcrumb(props.name, {
  //   value: JSON.stringify(props.value) ?? {},
  //   preview: props.preview ?? '',
  // })
}
