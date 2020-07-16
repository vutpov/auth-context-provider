class ResponseError extends Error{
  response = null
  constructor(message: string, response: any) {
    super(message)
    this.response = response
  }
}

export default ResponseError
