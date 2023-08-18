import { createAgent } from '@connectifi/agent-web'
import { DesktopAgent } from '@finos/fdc3'
import { IContainerGlobal, connectedFerry, contextFerry, openFerry, resolveFerry } from './ferry';
import { isHeadless, onAuthFail } from './utils';

class EnvironmentError extends Error {}

const environmentCheck = () => {
  try {
    if (window.fdc3) {
      throw new EnvironmentError('"fdc3" global already found')
    }

    if (window.chrome === undefined) {
      throw new EnvironmentError('"chrome" not found on "window"')
    }

    if (window.chrome.webview === undefined) {
      throw new EnvironmentError('"webview" not found on "window.chrome" global')
    }
  } catch (e) {
    console.error('Environment Check Failed')
    console.error(e)
  }
}

const addFDC3Global = async () => {
  const headless = isHeadless()

  console.log('Headless Value', headless)

  window.fdc3 = await createAgent(
    'https://dev.connectifi-interop.com',
    'local-dotnet@DemoSecure',
    {
      // headless is required to disable the resolver UI
      headless,
      resolverHandler: resolveFerry,
      openHandler: openFerry,
      onAuthFail,
      onConnect: connectedFerry
    }
  ) as DesktopAgent;
};

const setupListeners = async () => {
  // TODO refactor
  const listener = await window.fdc3.addContextListener(null, contextFerry)

  window.addEventListener('beforeunload', () => {
    listener.unsubscribe()
  })
}

const initializeContainerGlobal = () => {
  const defaultContainerGlobal: IContainerGlobal  = {
    handleIntentResolution: (selected, intent) => {
      console.log(`Default handleIntentResolution for ${selected} ${intent}`)
    },
    clickSignIn: () => {
      console.log('Default clickSignIn')
    }
  }
  window.__container = defaultContainerGlobal
}

const init = async () => {
  try {
    initializeContainerGlobal()
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