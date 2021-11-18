// import Bugsnag from '@bugsnag/react-native'

export const log = (...props: any) => {
  if (__DEV__) {
    // @ts-ignore
    console.tron.log(props)
  } else {
    console.log(props)
  }
  // Bugsnag.leaveBreadcrumb('Log', { value: JSON.stringify(props) })
}

export const display = (props: any) => {
  if (__DEV__) {
    console.tron.display(props)
  } else {
    console.log(props)
  }
  // Bugsnag.leaveBreadcrumb(props.name, {
  //   value: JSON.stringify(props.value) ?? {},
  //   preview: props.preview ?? '',
  // })
}
