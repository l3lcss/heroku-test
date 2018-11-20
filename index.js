const { db } = require('./config/firebaseConfig')
const express = require('express')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT || 5000
app.use(cors())
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

app.listen(PORT, () => console.log('application is listening on:', PORT))