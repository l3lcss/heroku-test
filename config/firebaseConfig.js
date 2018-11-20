const admin = require('firebase-admin')
const serviceAccount = require('./FirebaseAdminConfig.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
admin.firestore().settings({ timestampsInSnapshots: true})

const db = admin.firestore()

module.exports = { 
  db
 }
