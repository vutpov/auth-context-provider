import React, { useState, useCallback } from 'react'
import { useAuthContext } from 'auth-context-provider'

const FormLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const auth: any = useAuthContext()

  const onSubmit = useCallback(
    (authenticationInfo) => {
      auth.login(authenticationInfo)
    },
    [auth]
  )

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({ username, password })
        }}
      >
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
          }}
        />

        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <button type={'submit'}>Submit</button>
      </form>
      <br />

      <pre>
        {JSON.stringify(auth)}
      </pre>
    </>
  )
}

export default FormLogin
