import { authFailFerry } from "./ferry"

export const isHeadless = () => (window.localStorage.getItem('headless') === 'true')

const clickSignInButton = () => {
  const fabRoot = document.querySelectorAll('div[id^="fabRoot"]')[0]
  const signInButton = fabRoot.shadowRoot?.querySelectorAll('[title="sign in"]')[0]
  if (signInButton) {
    (signInButton as HTMLButtonElement).click()
  } else {
    console.log('Unable to find Sign In Button')
  }
}

export const onAuthError = (directory: string) => {
  if (isHeadless()) {
    window.localStorage.setItem('headless', 'false')
    window.location.reload()
  } else {
    authFailFerry(directory)
    window.localStorage.setItem('headless', 'true')
    clickSignInButton()
  }
}