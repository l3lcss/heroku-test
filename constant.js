const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message/push'
const LINE_HEADER = {
  'Content-Type': 'application/json'
}
const LINE_ACCESS_TOKEN_API = 'https://api.line.me/v2/oauth/accessToken'
const LINE_ACCESS_TOKEN_BODY = {
  grant_type: 'client_credentials',
  client_id: '1643699444',
  client_secret: '8fa78b32b71e384354ccc610503fb5db'
}

module.exports = {
  LINE_MESSAGING_API,
  LINE_HEADER,
  LINE_ACCESS_TOKEN_API,
  LINE_ACCESS_TOKEN_BODY
}