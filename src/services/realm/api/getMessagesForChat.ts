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
    const resp = realm.objects(schema)
    // display({
    //   name: 'REALM GETMESSGSEGSODSF',
    //   preview: 'LETS SEE',
    //   important: true,
    //   value: { resp },
    // })
    const respRet = resp.filter((element: any) => element.chat_id === id).slice(0, 500)
    // display({
    //   name: 'REALM GETMESSGSEGSODSF',
    //   preview: 'LETS SEE x2',
    //   important: true,
    //   value: { resp, respRet },
    // })
    return respRet
  } catch (e) {
    console.log(`Error on getting data from schema: ${schema}`)
    console.log(`error: ${e}`)
    return e
  }
}
