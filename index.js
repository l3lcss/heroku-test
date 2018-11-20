const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const { db } = require('./config/firebaseConfig')
app.use(express.static('public'))

app.get('/', async (req, res) => {
  let results = []
  let snapshot = await db.collection('User').get()
  snapshot.forEach(doc => {
    results.push(doc.data())
  })
  res.json({
    status: 200,
    message: 'Hello World v.2 test deploying',
    results
  })
})

app.listen(PORT, () => console.log('application is listening on:', PORT))