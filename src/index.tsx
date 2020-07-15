import React from 'react'
import BaseContextProvider, {
  baseUseContext,
  baseWithContext,
  baseContextWrap
} from 'base-context-provider'

export interface AuthContextProps {
  authUrl: string
  storageType?: 'localStorage' | 'cookies'
}

export interface AuthState<T> {
  isLogin: boolean
  isFetchingUser: boolean
  user: T
}

const Context = React.createContext({})

class AuthContextProvider extends BaseContextProvider<
  AuthContextProps,
  AuthState<any>
> {
  state = {
    isLogin: false,
    isFetchingUser: false,
    user: {
      username: ''
    }
  }

  getContext() {
    return Context
  }

  fetchUser: (password: string) => void = async (password) => {
    this.setState({
      isFetchingUser: true
    })
    const { authUrl } = this.props
    const { username } = this.state.user

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()
    localStorage.setItem('token', data.token)
  }

  login = ({ username, password }: { username: string; password: string }) => {
    this.setState(
      (oldState) => {
        return {
          ...oldState,
          user: {
            ...oldState.user,
            username
          }
        }
      },
      () => {
        this.fetchUser(password)
      }
    )
  }

  logout = async () => {
    this.setState({
      isLogin: false,
      user: {
        username: ''
      }
    })

    return Promise.resolve(true)
  }

  getContextReturnValue() {
    return {
      ...this.state,
      login: this.login,
      logout: this.logout
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
