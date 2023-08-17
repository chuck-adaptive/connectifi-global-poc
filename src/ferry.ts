import { AgentConfig, IntentResolutionMessage, ResolveCallback } from "@connectifi/agent-web"
import { ContextHandler } from "@finos/fdc3"
export * from './types'

export const contextFerry: ContextHandler = (context) => {
  console.log('BEGIN contextFerry call')
  console.log(context)
  window.chrome?.webview?.postMessage(JSON.stringify({ guid: 'contextListener', context }))
  console.log('END contextFerry call')
}

export const resolveFerry: AgentConfig["resolverHandler"] = (
  message: IntentResolutionMessage,
  callback: ResolveCallback
) => {
  console.log('BEGIN resolveFerry call')
  console.log(message)
  window.__container.handleIntentResolution = callback
  console.log('updated __container.handleIntentResolution')
  window.chrome?.webview?.postMessage(JSON.stringify({ guid: 'resolveFerry', message}))
  console.log('END resolveFerry call')
}

export const openFerry: AgentConfig["openHandler"] = (message) => {
  console.log('BEGIN openFerry call')
  console.log(message)
  window.chrome?.webview?.postMessage(JSON.stringify({ guid: 'openFerry', message}))
  console.log('END openFerry call')
}