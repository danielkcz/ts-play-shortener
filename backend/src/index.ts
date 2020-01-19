import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

require('source-map-support').install()

admin.initializeApp()

exports.main = functions.region('europe-west1').https.onRequest(require('./main'))
