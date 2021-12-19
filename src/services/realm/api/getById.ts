import { display } from 'lib/logging'
import { realm } from './realm.instance'
import { Get } from './types/get.interface'

/**
 * Get by id function
 * @param {string} props.schema - Name of schema where we will get data
 * @param {number} props.id - Id of the record in realm
 */
export default (props: Get) => {
  const { schema, id } = props
  try {
    const thisiswhattttt = realm.objects(schema)
    display({
      name: 'getById',
      value: { thisiswhattttt },
      important: true,
      preview: 'WHAT THE FUCK IS THIS',
    })
    const resp = realm.objects(schema).find((element: any) => element.id === id)
    return resp
  } catch (e) {
    console.log(`Error on getting data from schema: ${schema}`)
    console.log(`error: ${e}`)
    return e
  }
}
