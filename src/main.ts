import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { createAgent } from '@connectifi/agent-web'
import { DesktopAgent } from '@finos/fdc3'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const fdc3Global = async () => {
  //create the agent and assign to the window
  window.fdc3 = await createAgent(
    'https://dev.connectifi-interop.com',
    'local-dotnet@Demo'
  ) as DesktopAgent;

  //fire the fdc3Ready event
  document.dispatchEvent(new CustomEvent('fdc3Ready', {}));
};

fdc3Global()
