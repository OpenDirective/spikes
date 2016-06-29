import test from 'blue-tape'
//import Kinvey from 'kinvey-html5-sdk'
//import {User} from 'kinvey-javascript-sdk-core/es5/user.js'
// Kinvey is a global script - see ../index.html

import kconfig from './kinvey-config'

export default function runTests () {
  test('Kinvey client SDK', t => {
    const kd = KinveyDevice.toJSON()
    t.equal(kd.kinveySDK.name, 'kinvey-html5-sdk')
    t.comment(`[info] sdk version: ${kd.kinveySDK.version}`)
    t.end()
  })

  test('Init Kinvey client', (t) => {
    const client = Kinvey.init({appKey: kconfig.appKey,
                                appSecret: kconfig.appSecret})

    t.equal(client.constructor.name, "Client",
      'A Client must be returned')
    t.end()
  })

  test('Ping Kinvey', (t) => {
    t.timeoutAfter(kconfig.WIRE_TIMEOUT)
    return Kinvey.ping()
      .then((response) => {
        t.equal(response.appName, kconfig.appName,
          'appName must agree with that specified in config')
        t.comment(`[info] Kinvey version: ${response.version}`)
      })
      .catch(({response: {statusCode, data}}) =>
         t.fail(`Kinvey response: ${statusCode} ${data}`))
  })
}
