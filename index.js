const { db } = require('./config/firebaseConfig')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const axios = require('axios')
const querystring = require('querystring')
const { LINE_MESSAGING_API, LINE_HEADER, LINE_ACCESS_TOKEN_API, LINE_ACCESS_TOKEN_BODY, THAI_ASCII } = require('./constant')
const { FireSQL } = require('firesql')
const crypto = require('crypto-js')
const moment = require('moment')
const PORT = process.env.PORT || 5000
app.use(cors())
app.use(bodyParser.json({
  type: '*/*'
}))
app.use(express.static('public'))

app.get('/', async (req, res) => {
  res.send({
    status: 200,
    message: 'Hello World !!',
    server_time: new Date()
  })
})

app.get('/getuser', async (req, res) => {
  const fireSQL = new FireSQL(db)
  let snapshot = await fireSQL.query(`SELECT * 
  FROM User
  WHERE name = 'test text'
  ORDER BY name DESC`)
  let results = []
  // let snapshot = await db.collection('User').get()
  res.json({
    status: 200,
    snapshot
  })
})

app.post('/line-token', async (req, res) => {
  const {code, redirect_uri} = req.body
  const data = {
    grant_type: 'authorization_code',
    client_id: '1635880494',
    client_secret: 'd105fd17568b15c6f427b1d1974586e5',
    code,
    redirect_uri
  }

  const options = {
    method: 'POST',
    data: querystring.stringify(data),
    url: 'https://api.line.me/oauth2/v2.1/token'
  }
  const results = await axios(options)
  res.send(results.data)
})

app.post('/line-push-message', async (req, res) => {
  const { userId } = req.body
  let results = {
    success: 1
  }
  const options1 = {
    method: 'POST',
    data: querystring.stringify(LINE_ACCESS_TOKEN_BODY),
    url: LINE_ACCESS_TOKEN_API
  }
  try {
    const { data: { access_token } } = await axios(options1)
    LINE_HEADER.Authorization = `Bearer ${access_token}`
  } catch (error) {
    results.success = 0
    results.message = error.response.data
    res.send(results)
  }

  const data = {
    to: userId,
    messages: [
      {
        "type": "text",
        "text": "Hello, world"
      },
      {
        "type": "text",
        "text": "Hello, world2"
      }
    ]
  }
  const options2 = {
    method: 'POST',
    data,
    url: LINE_MESSAGING_API,
    headers: LINE_HEADER
  }
  try {
    const { data } = await axios(options2)
    results.message = data
  } catch (error) {
    results.success = 0
    results.message = error.response.data
  }
  res.send(results)
})
app.post('/ctd-fetch-data', async (req, res) => {
  const { headers } = req
  const origin = headers.origin
  if (origin === 'https://ctd-table.netlify.com' || origin === 'http://localhost:8080') {
    const authorization = headers.authorization
    let { id } = req.body
    for (let i = 0; i < id.length; i++) {
      for (const key in THAI_ASCII) {
        if (id[i] === key) {
          id = id.replace(id[i], THAI_ASCII[key])
        }
      }
    }
    const options = {
      method: 'GET',
      url: `http://203.150.102.19:8999/tms/order/registration/${id}?token=${authorization}`,
    }
    try {
      let { data } = await axios(options)
      res.send({ ...data, headers })
    } catch (error) {
      res.send(error.response.data)
    }
  } else {
    res.send('')
  }
})
app.post('/ctd-auth', async(req, res) => {
  const { headers } = req
  const origin = headers.origin
  if (origin === 'https://ctd-table.netlify.com' || origin === 'http://localhost:8080' || origin === 'https://ctd-truck-status.netlify.com') {
    const options = {
      method: 'POST',
      url: `http://203.150.102.19:8999/tms/user/auth`,
      data: {
        user_id: 'sellsuki',
        password: 'dnD7q6x8E6'
      }
    }
    try {
      const { data: { token } } = await axios(options)
      res.send({ token, headers })
    } catch (error) {
      res.send({ error, headers })    
    }
  } else {
    res.send('')
  }
})
app.post('/ctdsearchapi', async(req, res) => {
  const { headers } = req
  const origin = headers.origin
  if (origin === 'https://ctd-table.netlify.com' || origin === 'http://localhost:8080' || origin === 'https://ctd-truck-status.netlify.com') {
    const options = {
      method: 'POST',
      url: 'http://ctdsearchapi-env-staging.qmw37utqwr.ap-southeast-1.elasticbeanstalk.com/v1/query/',
      data: {
        index: 'ctd_gps',
        search: {
          query: {
            bool: {
              filter: {
                exists: { field: 'id' }
              },
              must_not: {
                term: { 'id.keyword': '' }
              }
            }
           },
          size: 999
        }
      }
    }
    let { data: { search: { hits: { hits } } } } = await axios(options)
    res.send({ hits })
  } else {
    res.send('')
  }
})
app.post('/ctdsearchapi-noti', async(req, res) => {
  const { headers } = req
  const origin = headers.origin
  console.log(origin, 'origin')
  if (origin === 'https://ctd-table.netlify.com' || origin === 'http://localhost:8080' || origin === 'https://ctd-truck-status.netlify.com') {
    const options = {
      method: 'POST',
      url: 'http://ctdsearchapi-env-staging.qmw37utqwr.ap-southeast-1.elasticbeanstalk.com/v1/query/',
      data: {
        index: 'ctd_gps_notification',
        search: {
          query: {
            bool: {
              filter: {
                exists: { field: 'id' }
              },
              must_not: {
                term: { 'id.keyword': '' }
              }
            }
           },
          size: 999
        }
      }
    }
    let { data: { search: { hits: { hits } } } } = await axios(options)
    res.send({ hits })
  } else {
    res.send('')
  }
})
app.get('/test-hook', async (req, res) => {
  let results = {
    success: 1
  }
  const options = {
    method: 'post',
    url: 'https://us-central1-guyy-staging.cloudfunctions.net/app/oLyLRo9Ev6/webhook',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      "bill": {
          "id": "O0117HWH23200017",
          "url": "lIogaCd",
          "expire": "2017-02-07 16:59:59",
          "discount": "0.00",
          "ship_cost": "30.00",
          "net": "4310.00",
          "note": "FB14602",
          "print_tag_date": null,
          "shipping_ref_code": null,
          "bill_type": "standard",
          "bill_offer_type": "bill",
          "current_state": "paid",
          "shipment_timestamp": null,
          "flag_bill_seen": "0",
          "status": "1",
          "create_by_sellsuki_user_id": "16766",
          "update_by_sellsuki_user_id": "16801",
          "create_time": "2017-01-30 12:28:14",
          "update_time": "2017-02-06 14:21:34",
          "currency_id": "139",
          "store_id": "13823",
          "store_channel_type": "facebook",
          "customer_name": "Muay'yada Makhampom",
          "customer_shipping_name": "\u0e0d\u0e32\u0e14\u0e32  \u0e40\u0e01\u0e23\u0e35\u0e22\u0e07\u0e44\u0e01\u0e23\u0e27\u0e38\u0e12\u0e34\u0e01\u0e38\u0e25",
          "customer_address": "480 \u0e2b\u0e21\u0e39\u0e48 7  \u0e15.\u0e40\u0e0a\u0e35\u0e22\u0e07\u0e14\u0e32\u0e27  \u0e2d.\u0e40\u0e0a\u0e35\u0e22\u0e07\u0e14\u0e32\u0e27\r\n\u0e08.\u0e40\u0e0a\u0e35\u0e22\u0e07\u0e43\u0e2b\u0e21\u0e48",
          "customer_postcode": "50170",
          "customer_country": "Thailand",
          "customer_tel": "+66811111122",
          "customer_email": "yada.mkp@hotmail.com",
          "customer_picture_credential": "1132160473473036",
          "store_offer_id": "30861",
          "flag_closed_bill": "0",
          "stock_timestamp": null,
          "cache_shipping_type": "EMS",
          "concat_warehouse": "sellsuki",
          "prepare_shipment_timestamp": null,
          "notify_shipment_timestamp": null
      },
      "event": "confirmtopaid",
      "bill_payment": {
          "id": "1407434",
          "bill_id": "O0117HWH23200407",
          "bill_debt_pay_order": "1",
          "date": "2017-02-06 14:12:00",
          "amount": "4310.00",
          "create_time": "2017-02-06 14:21:34",
          "store_payment_channel_id": "24265",
          "attached_slip": null,
          "additional_payment_status": null,
          "cache_payment_channel_name": "\u0e01\u0e2a\u0e34\u0e01\u0e23\u0e44\u0e17\u0e22",
          "cache_payment_channel_id": "1",
          "cache_payment_channel_logo": "\/img\/bank\/bank-kasikorn.png",
          "cache_payment_channel_type": "bank",
          "cache_store_payment_channel_credential": "{acc_name}"
      },
      "sku": [{
          "sku_photo": "https:\/\/sellsuki-picture.s3-ap-southeast-1.amazonaws.com\/20160704215806fHmPSBzRid_13823",
          "sku_name": "NAVY,23.0,",
          "sku_id": "3280774",
          "product_name": "COTTON [REAL SUPPORT]",
          "amount": "1.00",
          "price": "4280.00",
          "sku_code": "5692700014-1",
          "line_item_sfdc_id": null
      },
      {
          "sku_photo": "https:\/\/sellsuki-picture.s3-ap-southeast-1.amazonaws.com\/20160704215806fHmPSBzRid_13823",
          "sku_name": "NAVY,23.0,",
          "sku_id": "3280774",
          "product_name": "COTTON [REAL SUPPORT]",
          "amount": "1.00",
          "price": "4280.00",
          "sku_code": "5692700001-1",
          "line_item_sfdc_id": null
      }]
    }
  }
  try {
    const { data } = await axios(options)
    results.message = data
  } catch (error) {
    results.success = 0
    results.message = error.response.data
  }
  res.send(results)
})

app.post('/line-request', async(req, res) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': `application/json`,
      'X-LINE-ChannelId': `1576541010`,
      'X-LINE-ChannelSecret': `42a61e669399da0a4144d89009106116`
    },
    data: {
      'productName': 'Insurance',
      'amount': 10000,
      'currency': 'THB',
      'orderId': 'A12b3c',
      'confirmUrl': 'https://line-insurance.herokuapp.com/already-pay',
      'langCd': 'th'
    },
    url: `https://sandbox-api-pay.line.me/v2/payments/request`
  }
  try {
    const { data } = await axios(options)
    console.log(data, 'data')
    res.send(data)
  } catch (error) {
    console.log(error, 'error')
    res.send(results)
  }
})

app.post('/api-submit', async(req, res) => {
  res.send({
    status: 200,
    message: 'done'
  })
  res.end()
})

app.listen(PORT, () => console.log('application is listening on:', PORT))