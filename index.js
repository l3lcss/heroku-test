const { db } = require('./config/firebaseConfig')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const axios = require('axios')
const querystring = require('querystring')
const { LINE_MESSAGING_API, LINE_HEADER, LINE_ACCESS_TOKEN_API, LINE_ACCESS_TOKEN_BODY, THAI_ASCII } = require('./constant')

const PORT = process.env.PORT || 5000
app.use(cors())
app.use(bodyParser.json({
  type: '*/*'
}))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send({
    status: 200,
    message: 'Hello World',
    server_time: new Date()
  })
})
app.get('/getuser', async (req, res) => {
  let results = []
  let snapshot = await db.collection('User').get()
  snapshot.forEach(doc => {
    results.push(doc.data())
  })
  res.json({
    status: 200,
    results
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
  if (origin === 'https://ctd-table.netlify.com' || origin === 'http://localhost:8080') {
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
  if (origin === 'https://ctd-table.netlify.com' || origin === 'http://localhost:8080') {
    const options = {
      method: 'POST',
      url: 'http://ctdsearchapi-env-staging.qmw37utqwr.ap-southeast-1.elasticbeanstalk.com/v1/query/',
      data: {
        index: 'ctd_gps',
        search: {
          query: { match_all: {} },
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

app.listen(PORT, () => console.log('application is listening on:', PORT))