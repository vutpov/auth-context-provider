interface TokenInstance {
  getToken: () => string
  setToken: (token: string) => void
}

const tokenKey = 'token'

class LocalStorageToken implements TokenInstance {
  getToken = () => {
    return localStorage.getItem(tokenKey) || ''
  }

  setToken = (token: string) => {
    localStorage.setItem(tokenKey, token)
  }
}

export { LocalStorageToken, TokenInstance }
