import { ResolveCallback } from "@connectifi/agent-web";

export {}

interface WebViewEventListenerObject {
    handleEvent(object: Event & { data?: any }): void;
}

interface WebViewEventListener
{
    (evt: Event & { data?: any }): void;
}

export interface IContainerGlobal {
    handleIntentResolution: ResolveCallback;
    clickSignIn: () => void;
    registerIntentWithGuid: (intent: string, dotNetGuid: string) => void;
}

// Just some types for the WebView2 globals
// Not officiall on definitely-typed yet, but the surface area of the APIs we are using is small
declare global {
  interface Window {
      __container: IContainerGlobal;
      chrome?: {
          webview?: {
              addEventListener: (
                  type: string,
                  listener: WebViewEventListener | WebViewEventListenerObject,
                  options?: boolean | {}
              ) => void;
              postMessage: (message: string) => void;
          };
      };
  }
}