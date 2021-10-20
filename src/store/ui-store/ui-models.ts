import { Instance, types } from 'mobx-state-tree'

export const InvoiceMsgModel = types.model('InvoiceMsg').props({
  id: types.identifierNumber,
  payment_request: types.string,
  amount: types.number,
})

export interface InvoiceMsg extends Instance<typeof InvoiceMsgModel> {}
