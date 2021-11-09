// @ts-nocheck
import { reportError } from 'lib/errorHelper'

type RelayMethod = (url: string, data?: any, encoding?: string, options?: APIOptions) => any
export default class API {
  constructor(url: string, tokenKey?: string, tokenValue?: string, resetIPCallback?: Function) {
    this.get = addMethod('GET', url)
    this.post = addMethod('POST', url)
    this.put = addMethod('PUT', url)
    this.del = addMethod('DELETE', url)
    this.upload = addMethod('UPLOAD', url)
    if (tokenKey) this.tokenKey = tokenKey
    if (tokenValue) this.tokenValue = tokenValue
    if (resetIPCallback) this.resetIPCallback = resetIPCallback
  }
  tokenKey: string
  tokenValue: string
  get: RelayMethod
  post: RelayMethod
  put: RelayMethod
  del: RelayMethod
  upload: RelayMethod
  resetIPCallback: Function
}

const TIMEOUT = 20000

type APIOptions = {
  rawValue?: boolean
  exceptionCallback?: (error: any) => void
}

function addMethod(m: string, rootUrl: string): RelayMethod {
  return async function (url: string, data: any, encoding?: string, options?: APIOptions) {
    if (!data) data = {}

    try {
      const skip = isPublic(rootUrl + url)
      if (this.tokenKey && !this.tokenValue && !skip) {
        // throw new Error("no token")
        return
      }
      const headers: { [key: string]: string } = {}
      if (this.tokenKey && this.tokenValue) {
        headers[this.tokenKey] = this.tokenValue
      }
      const opts: { [key: string]: any } = { mode: 'cors' }
      if (m === 'POST' || m === 'PUT') {
        if (encoding) {
          headers['Content-Type'] = encoding
          if (encoding === 'application/x-www-form-urlencoded') {
            opts.body = makeSearchParams(data)
          } else {
            opts.body = data
          }
        } else {
          headers['Content-Type'] = 'application/json'
          opts.body = JSON.stringify(data)
        }
      }
      if (m === 'UPLOAD') {
        headers['Content-Type'] = 'multipart/form-data'
        opts.body = data
        console.log('UPLOAD DATA:', data)
      }
      opts.headers = new Headers(headers)

      opts.method = m === 'UPLOAD' ? 'POST' : m
      if (m === 'BLOB') opts.method = 'GET'

      // console.log('=>',opts.method,rootUrl + url)

      const r = await fetchTimeout(rootUrl + url, TIMEOUT, opts)
      if (!r.ok) {
        console.log('------')
        console.log(r)
        console.log('------')
        console.log('Not OK!', r.status, url)
        console.log('------')
        return
      }
      let res
      if (m === 'BLOB') res = await r.blob()
      else {
        res = await r.json()
        if (res.token) {
          // localStorage.setItem(tokenName, res.token)
        }
        if (res.error) {
          // console.warn(res.error)
          return
        }
        if (res.status && res.status === 'ok') {
          // invite server
          return options.rawValue ? res : res.object
        }
        if (res.success && res.response) {
          // relay
          return res.response
        }
        return res
      }
    } catch (e) {
      reportError(e)
      // 20 is an "abort" i guess
      // console.warn(e, 'url', url)
      if (options?.exceptionCallback && typeof options?.exceptionCallback === 'function') {
        options.exceptionCallback(e)
      }
      const isWebAbort = e.code === 20
      const isRNAbort = e.message === 'Aborted'
      if (isWebAbort || isRNAbort) reportTimeout(this.resetIPCallback)
    }
  }
}

let timeoutCount = 0
function reportTimeout(resetIPCallback: Function) {
  timeoutCount += 1
  if (timeoutCount === 3) {
    if (resetIPCallback) resetIPCallback()
  }
}

function isPublic(url: string) {
  return url.endsWith('login')
}

async function getToken(name: string) {
  if (!name) return ''
  // return localStorage.getItem(name)
}

function makeSearchParams(params) {
  return Object.keys(params)
    .map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    })
    .join('&')
}

const fetchTimeout = (url, ms, options = {}) => {
  const controller = new AbortController()
  const promise = fetch(url, { signal: controller.signal, ...options })
  const timeout = setTimeout(() => controller.abort(), ms)
  return promise.finally(() => clearTimeout(timeout))
}
