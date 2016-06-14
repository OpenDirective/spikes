import test from 'blue-tape'
//import Kinvey from 'kinvey-html5-sdk'
//import {User} from 'kinvey-javascript-sdk-core/es5/user.js'
// Kinvey is a global script - see ../index.html

import config from './kinvey-config'
import testUser from './testUser'

// Timeout for tests that wait for a reponse from Kinvey backend
const WIRE_TIMEOUT = 5000
const KILL_TIMEOUT = 3000

function runTests () {
  test('Kinvey client SDK', t => {
    const kd = KinveyDevice.toJSON()
    t.equal(kd.kinveySDK.name, 'kinvey-html5-sdk')
    t.comment(`[info] sdk version: ${kd.kinveySDK.version}`)
    t.end()
  })

  test('Init Kinvey client', (t) => {
    const client = Kinvey.init({appKey: config.appKey,
                                appSecret: config.appSecret})

    t.equal(client.constructor.name, "Client",
      'A Client should be returned')
    t.end()
  })

  test('Ping Kinvey', (t) => {
    t.timeoutAfter(WIRE_TIMEOUT)
    return Kinvey.ping()
      .then((response) => {
        t.equal(response.appName, config.appName,
          'appName should agree with appId specified in config')
        t.comment(`[info] Kinvey version: ${response.version}`)
      })
      .catch(({response: {statusCode, data}}) =>
         t.fail(`Kinvey response: ${statusCode} ${data}`))
  })

  testUser()

}

function execute() {
  runTests()

  // throwing forces browser-run to exit, else npm test hangs
  setTimeout(() => {throw "exiting"}, KILL_TIMEOUT)
}

//window.onload = execute
execute()
