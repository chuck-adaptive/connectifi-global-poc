import { createAgent } from '@connectifi/agent-web'
import { DesktopAgent } from '@finos/fdc3'
import { contextFerry } from './context-ferry';

class EnvironmentError extends Error {}

const environmentCheck = () => {
  if (window.fdc3) {
    throw new EnvironmentError('"fdc3" global already found')
  }

  if (window.chrome === undefined) {
    throw new EnvironmentError('"chrome" not found on "window"')
  }

  if (window.chrome.webview === undefined) {
    throw new EnvironmentError('"webview" not found on "window.chrome" global')
  }
}

const onDisconnect = async () => {
  // TODO - fully handle disconnect
  await init()
}

const addFDC3Global = async () => {
  window.fdc3 = await createAgent(
    'https://dev.connectifi-interop.com',
    'local-dotnet@Demo',
    {
      onDisconnect
    }
  ) as DesktopAgent;
};

const setupListeners = async () => {
  const listener = await window.fdc3.addContextListener(null, contextFerry)

  window.addEventListener('beforeunload', () => {
    listener.unsubscribe()
  })
}

const init = async () => {
  try {
    environmentCheck()
    await addFDC3Global()
    await setupListeners()

    // WebView2 can wait for this all to be complete
    // https://stackoverflow.com/a/66053672
    // https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.winforms.webview2.navigationcompleted?view=webview2-dotnet-1.0.705.50&WT.mc_id=DT-MVP-5003235
    // the NavigationComplete event fires when the onload is complete
  } catch (e) {
    if (e instanceof EnvironmentError) {
      console.log('Environment Error - is the page running in a WebView2?')
      console.log('Error Message: ', e.message)
    } else {
      console.log('Unknown Error', e)
    }
  }
}

init()