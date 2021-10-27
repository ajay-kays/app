import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Dialog } from 'react-native-paper'
import { useTheme } from 'store'
import Input from './inputs'
import { Button } from 'views/common'

export default function Form(props) {
  const theme = useTheme()
  const { labelColor = theme.white } = props
  if (!props.schema) return <Text>please provide schema</Text>

  return (
    <Formik
      initialValues={props.initialValues || {}}
      onSubmit={(values) => {
        props.onSubmit(values)
      }}
      validationSchema={validator(props.schema)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        setFieldValue,
        errors,
        dirty,
        isValid,
      }) => {
        const d = !props.forceEnable && (!dirty || !isValid)
        return (
          <View style={styles.wrap}>
            <View style={{ padding: props.nopad ? 0 : 25 }}>
              {props.schema.map((item) => {
                const readOnly = props.readOnlyFields && props.readOnlyFields.includes(item.name)
                return (
                  <Input
                    key={item.name}
                    {...item}
                    accessibilityLabel={`form-input-${item.name}`}
                    value={values[item.name]}
                    displayOnly={props.displayOnly || readOnly}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setValue={(data) => setFieldValue(item.name, data)}
                    error={errors[item.name]}
                    numberOfLines={item.numberOfLines}
                  />
                )
              })}
            </View>

            {!props.displayOnly && (
              <Action type={props.actionType} nopad={props.nopad} rowContent={props.rowContent}>
                <Button
                  mode={props.buttonMode}
                  accessibilityLabel={props.buttonAccessibilityLabel || 'form-button'}
                  onPress={handleSubmit}
                  disabled={!props.forceEnable && (!dirty || !isValid)}
                  color={props.btnColor}
                  fs={props.btnFs}
                  size={props.btnSize}
                  w={props.btnW ? props.btnW : '60%'}
                  style={{ ...props.btnStyles }}
                  // labelStyle={{ color: labelColor, opacity: d ? 0.5 : 1 }}
                  loading={props.loading}
                >
                  {props.buttonText || 'Submit'}
                </Button>
              </Action>
            )}
          </View>
        )
      }}
    </Formik>
  )
}

function Action({ type, nopad, rowContent, children }) {
  switch (type) {
    case 'Wide':
      return (
        <View
          style={{
            padding: nopad ? 0 : 25,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {children}
        </View>
      )
    case 'Row':
      return (
        <View style={{ ...styles.rowWrap, padding: nopad ? 0 : 25 }}>
          {rowContent}
          {children}
        </View>
      )
    case 'Dialog':
      return <Dialog.Actions>{children}</Dialog.Actions>
    default:
      return <></>
      break
  }
}

Form.defaultProps = {
  actionType: 'Wide',
  buttonMode: 'contained',
  btnSize: 'large',
}

function validator(config) {
  const shape = {}
  config.forEach((field) => {
    if (typeof field === 'object') {
      shape[field.name] = field.validator
    }
  })
  return Yup.object().shape(shape)
}

const styles = StyleSheet.create({
  wrap: {},
  rowWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})
