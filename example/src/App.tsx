import React from 'react'

import AuthContextProvider from 'auth-context-provider'
import FormLogin from './FormLogin'

const App = () => {
  return <FormLogin/>
}

const authUrl = 'http://localhost:8080/authenticate'

const EnhancedApp = () => {
  return <AuthContextProvider authUrl={authUrl}>
    <App />
  </AuthContextProvider>
}

export default EnhancedApp
