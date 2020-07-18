import React from 'react'
import {wrapAuthContext} from 'auth-context-provider'
import FormLogin from './FormLogin'

const App = () => {
  return <FormLogin/>
}

const authUrl = 'http://dummyspringtoken-env-1.eba-hfxxdsvk.us-east-2.elasticbeanstalk.com/authenticate'

export default  wrapAuthContext(App, {
  authUrl
})

