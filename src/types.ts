import { ResolveCallback } from "@connectifi/agent-web";

export {}

interface WebViewEventListenerObject {
    handleEvent(object: Event & { data?: any }): void;
}

interface WebViewEventListener
{
    (evt: Event & { data?: any }): void;
}

// Just some types for the WebView2 globals
// Not officiall on definitely-typed yet, but the surface area of the APIs we are using is small
declare global {
  interface Window {
      __container: {
        handleIntentResolution: ResolveCallback;
      };
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