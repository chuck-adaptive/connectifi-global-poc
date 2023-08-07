import { ContextHandler } from "@finos/fdc3"
export * from './types'

export const contextFerry: ContextHandler = (context) => {
  console.log('contextFerry call')
  window.chrome?.webview?.postMessage(JSON.stringify({ guid: 'contextListener', context }))
}