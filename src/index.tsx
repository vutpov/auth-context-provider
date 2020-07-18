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
  validateUrl: string
  keysPropertyToValidate?: string[]
  storageType?: 'localStorage' | 'cookies'
}

enum LoadingType {
  'requesting token',
  'fetching user',
  'validating token'
}

export interface AuthLoadingInstance {
  isLoading: boolean
  type?: LoadingType
}

export interface AuthState<T> {
  isAuthenticated: boolean
  loading: AuthLoadingInstance
  user: T
}

const Context = React.createContext({})

class AuthContextProvider extends BaseContextProvider<
  AuthContextProps,
  AuthState<any>
> {
  state: AuthState<any> = {
    isAuthenticated: false,
    loading: {
      isLoading: false
    },
    user: {
      username: ''
    }
  }

  tokenInstance: TokenInstance | null | undefined = null

  constructor(props: AuthContextProps) {
    super(props)

    this.tokenInstance = new LocalStorageToken()
  }

  getContext() {
    return Context
  }

  requestToken: (username: string, password: string) => void = async (
    username,
    password
  ) => {
    this.setState({
      loading: {
        isLoading: true,
        type: LoadingType['requesting token']
      }
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
      return Promise.reject(
        new ResponseError('Error while fetching data', data)
      )
    }
    // eslint-disable-next-line no-unused-expressions
    this.tokenInstance?.setToken(data.token)

    this.setState((oldState) => {
      return {
        ...oldState,
        user: {
          ...oldState.user,
          username
        },
        isAuthenticated: true,
        loading: {
          isLoading: false
        }
      }
    })

    return Promise.resolve('')
  }

  login = async ({
    username,
    password
  }: {
    username: string
    password: string
  }) => {
    return this.requestToken(username, password)
  }

  logout = async () => {
    this.setState({
      isAuthenticated: false,
      user: {
        username: ''
      }
    })
    this.tokenInstance?.setToken('')
    return Promise.resolve(true)
  }

  getToken = () => {
    return this.tokenInstance?.getToken()
  }

  getContextReturnValue() {
    return {
      ...this.state,
      login: this.login,
      logout: this.logout,
      getToken: this.getToken
    }
  }

  validateToken = async (token: string, addtionalDataForValidate: any) => {
    this.setState({
      loading: {
        isLoading: true,
        type: LoadingType['validating token']
      }
    })

    const { validateUrl } = this.props
    const bearer = 'Bearer ' + token

    try {
      const response = await fetch(validateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: bearer,
          credentials: 'include'
        },
        body: JSON.stringify(addtionalDataForValidate)
      })

      const data = await response.json()

      if (response.status < 400 && data) {
        this.setState({
          loading: {
            isLoading: false
          },
          isAuthenticated: true
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  componentDidMount() {
    const newToken = this.tokenInstance?.getToken()

    if (newToken) {
      const { keysPropertyToValidate } = this.props
      let data: any = {}

      keysPropertyToValidate?.forEach((item) => {
        data[item] = this.tokenInstance?.getAdditionalDataForTokenValidation(
          item
        )
      })

      this.validateToken(newToken, data)
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
