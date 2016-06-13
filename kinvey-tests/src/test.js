import test from 'blue-tape'

import config from './kinvey-config'

// Timeout for tests that wait for a reponse from Kinvey backend
const WIRE_TIMEOUT = 1000

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

    t.equal(client.constructor.name, "Client")
    t.end()
  })

  test('Ping Kinvey', (t) => new Promise((resolve) => {
    t.timeoutAfter(WIRE_TIMEOUT)
    Kinvey.ping().then((response) => {
      t.equal(config.appName, response.appName)
      t.comment(`[info] Kinvey version: ${response.version}`)
      resolve()
    })
  }))

  test('Current user', (t) => {
    t.equal(Kinvey.User.getActiveUser(), null,
      'Active user should be null')
    t.end()
  })

}

function execute() {
  runTests()

  // throwing forces browser-run to exit, else npm test hangs
  setTimeout(() => {throw "exiting"}, 3000)
}

window.onload = execute
