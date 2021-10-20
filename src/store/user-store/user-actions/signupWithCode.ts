import { UserStore } from '../user-store'

export const signupWithCode = async (self: UserStore, code: string) => {
  console.log('signupWithCode', code)
  return { ['1']: 'yo' }
}
