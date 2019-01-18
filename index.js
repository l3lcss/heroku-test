const { db } = require('./config/firebaseConfig')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const axios = require('axios')
const querystring = require('querystring')

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

app.listen(PORT, () => console.log('application is listening on:', PORT))