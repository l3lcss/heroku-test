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
const THAI_ASCII = {
  'ก': '%A1',
  'ข': '%A2',
  'ฃ': '%A3',
  'ค': '%A4',
  'ฅ': '%A5',
  'ฆ': '%A6',
  'ง': '%A7',
  'จ': '%A8',
  'ฉ': '%A9',
  'ช': '%AA',
  'ซ': '%AB',
  'ฌ': '%AC',
  'ญ': '%AD',
  'ฎ': '%AE',
  'ฏ': '%AF',
  'ฐ': '%B0',
  'ฑ': '%B1',
  'ฒ': '%B2',
  'ณ': '%B3',
  'ด': '%B4',
  'ต': '%B5',
  'ถ': '%B6',
  'ท': '%B7',
  'ธ': '%B8',
  'น': '%B9',
  'บ': '%BA',
  'ป': '%BB',
  'ผ': '%BC',
  'ฝ': '%BD',
  'พ': '%BE',
  'ฟ': '%BF',
  'ภ': '%C0',
  'ม': '%C1',
  'ย': '%C2',
  'ร': '%C3',
  'ฤ': '%C4',
  'ล': '%C5',
  'ฦ': '%C6',
  'ว': '%C7',
  'ศ': '%C8',
  'ษ': '%C9',
  'ส': '%CA',
  'ห': '%CB',
  'ฬ': '%CC',
  'อ': '%CD',
  'ฮ': '%CE'
  

}

module.exports = {
  LINE_MESSAGING_API,
  LINE_HEADER,
  LINE_ACCESS_TOKEN_API,
  LINE_ACCESS_TOKEN_BODY,
  THAI_ASCII
}