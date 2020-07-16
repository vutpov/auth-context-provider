import React from 'react'
import BaseContextProvider, {
  baseUseContext,
  baseWithContext,
  baseContextWrap
} from 'base-context-provider'
import { LocalStorageToken, TokenInstance } from './TokenInstance'
import ResponseError from './ResponseError'

export interface AuthContextProps {
  authUrl: string
  storageType?: 'localStorage' | 'cookies'
}

export interface AuthState<T> {
  isLogin: boolean
  isFetchingUser: boolean
  user: T
  tokenInstance?: TokenInstance
}


const Context = React.createContext({})

class AuthContextProvider extends BaseContextProvider<
  AuthContextProps,
  AuthState<any>
> {
  state: AuthState<any> = {
    isLogin: false,
    isFetchingUser: false,
    user: {
      username: ''
    }
  }

  constructor(props: AuthContextProps) {
    super(props)

    this.state.tokenInstance = new LocalStorageToken()
  }

  getContext() {
    return Context
  }

  fetchUser: (username: string, password: string) => void = async (
    username,
    password
  ) => {
    this.setState({
      isFetchingUser: true
    })
    const { authUrl } = this.props

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()
    if (response.status >= 400) {
      return Promise.reject(new ResponseError("Error while fetching data", data ))
    }
    // eslint-disable-next-line no-unused-expressions
    this.state.tokenInstance?.setToken(data.token)

    this.setState((oldState) => {
      return {
        ...oldState,
        user: {
          ...oldState.user,
          username
        },
        isLogin: true,
        isFetchingUser: false
      }
    })

    return Promise.resolve("")
  }

  login = async ({
    username,
    password
  }: {
    username: string
    password: string
  }) => {
    return this.fetchUser(username, password)
  }

  logout = async () => {
    this.setState({
      isLogin: false,
      user: {
        username: ''
      }
    })
    this.state.tokenInstance?.setToken("")
    return Promise.resolve(true)
  }

  getToken = ()=>{
    return this.state.tokenInstance?.getToken()
  }

  getContextReturnValue() {
    return {
      ...this.state,
      login: this.login,
      logout: this.logout,
      getToken: this.getToken
    }
  }
}

// @ts-ignore
AuthContextProvider.defaultProps = {
  storageType: 'localStorage'
}

export const wrapAuthContext = baseContextWrap(AuthContextProvider)

export const useAuthContext = baseUseContext(Context)

export const withAuthContext = baseWithContext(Context, 'auth')

export default AuthContextProvider
