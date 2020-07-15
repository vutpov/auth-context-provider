import React from 'react'
import {wrapAuthContext} from 'auth-context-provider'
import FormLogin from './FormLogin'

const App = () => {
  return <FormLogin/>
}

const authUrl = 'http://localhost:8080/authenticate'

export default  wrapAuthContext(App, {
  authUrl
})

