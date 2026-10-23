import { headers } from 'next/headers'

import { REQUEST_PATH_HEADER } from './requestPathHeader'

/**
 * Path of the page currently being rendered (e.g. "/work/foo"), or `undefined`
 * outside a request / when the proxy did not run. Used as a form's `sourcePath`.
 * Server only; makes the caller dynamic (the frontend layout already is).
 */
export async function getRequestPath(): Promise<string | undefined> {
  try {
    const value = (await headers()).get(REQUEST_PATH_HEADER)
    return value && value.startsWith('/') && !value.startsWith('//') ? value : undefined
  } catch {
    return undefined
  }
}
