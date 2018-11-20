const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Hello World v.2'
  })
})

app.listen(PORT, () => console.log('application is listening on:', PORT))