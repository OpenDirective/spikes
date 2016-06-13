import test from 'blue-tape'

import config from './kinvey-config'

// Timeout for tests that wait for a reponse from Kinvey backend
const WIRE_TIMEOUT = 1000

function runTests () {
  test('Init Kinvey client', (t) => {
    const client = Kinvey.init({appKey: config.appKey,
                                appSecret: config.appSecret})

    // init() does NOT return a Client as the docs say
    // so just test it does not throw
    t.pass('Did not throw')
    t.end()
  })

  test('Ping Kinvey', (t) => new Promise((resolve) => {
    t.timeoutAfter(WIRE_TIMEOUT)
    Kinvey.ping().then((response) => {
      t.equal(config.appName, response.appName)
      t.comment(`Kinvey version: ${response.version}`)
      resolve()
    })
  }))

}

function execeute() {
  runTests()

  // throwing forces browser-run to exit, else npm test hangs
  setTimeout(() => {throw "exiting"}, 3000)
}

window.onload = execeute
