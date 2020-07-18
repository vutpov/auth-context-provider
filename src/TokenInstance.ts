interface TokenInstance {
  getToken: () => string
  setToken: (token: string) => void
  getAdditionalDataForTokenValidation: (key: string) => any
}

const tokenKey = 'token'

class LocalStorageToken implements TokenInstance {
  getToken = () => {
    return localStorage.getItem(tokenKey) || ''
  }

  setToken = (token: string) => {
    localStorage.setItem(tokenKey, token)
  }

  getAdditionalDataForTokenValidation = (key: string) => {
    return localStorage.getItem(key)
  }
}

export { LocalStorageToken, TokenInstance }
