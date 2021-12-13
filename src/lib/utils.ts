export const hasWhiteSpace = (s) => /\s/g.test(s)
export const isAlphaNumeric = (s) => /^[0-9a-z]+$/g.test(s)

export const extractURLSearchParams = (url: string) => {
  let regex = /[?&]([^=#]+)=([^&#]*)/g
  let match
  let params = {}
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2]
  }
  return params
}
