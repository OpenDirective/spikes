import test from 'blue-tape'
//import Kinvey from 'kinvey-html5-sdk'
//import {User} from 'kinvey-javascript-sdk-core/es5/user.js'
// Kinvey is a global script - see ../index.html

import kconfig from './kinvey-config'

const start = test

export default function runTests () {
  // user tests
  start('User Tests', (t) => {
    const user = Kinvey.User.getActiveUser()
    t.comment(`[info] Active user: ${user.data.username}`)
    if (user) {}
      t.comment(`[info] logging user out`)
 //     user.logout()
    t.end()
  })

  test('No Initial Current user', (t) => {
    t.equal(Kinvey.User.getActiveUser(), null,
      'Active user must be null')
    t.end()
  })

  test('New user Signup', (t) => {
    t.timeoutAfter(kconfig.WIRE_TIMEOUT)
    let user = new Kinvey.User()
    return user.signup(kconfig.testUser)
      .then((_user) => {
        const {data: {username, password}} = _user
        t.deepEqual({username, password}, kconfig.testUser,
          'Username and password should match')
        t.deepEqual(Kinvey.User.getActiveUser(), _user,
          'User should be set as active user')
      })
      .catch(({response: {statusCode, data}}) => {
        if (JSON.parse(data).error === 'UserAlreadyExists') {
          t.fail('testUser already exists - please delete')
        } else {
          t.fail(`Kinvey response: ${statusCode} ${data}`)
        }
      })
      .then(() => {
        user.logout()
      })
    })

  test('Suspended user Signup', (t) => {
    t.timeoutAfter(kconfig.WIRE_TIMEOUT)
    let user = new Kinvey.User()
    return user.signup(kconfig.suspendedUser)
      .then((_user) => {
        t.fail(`Should have failed`)
      })
      .catch((outcome) => {
        console.log('!!!!', outcome, outcome.constructor, typeof outcome, outcome.name)
        const {response: {statusCode, data}} = outcome
        if (JSON.parse(data).error === 'UserUnavailable') {
          t.pass('User expected to be unavailable')
        } else {
          t.fail(`Kinvey response: ${statusCode} ${data}`)
        }
      })
    })

  test('Locked user Signup', (t) => {
    t.timeoutAfter(kconfig.WIRE_TIMEOUT)
    let user = new Kinvey.User()
    return user.signup(kconfig.lockedUser)
      .then((_user) => {
        t.fail(`Should have failed`)
      })
      .catch(({response: {statusCode, data}}) => {
        if (JSON.parse(data).error === 'UserAlreadyExists') {
          t.pass('User expected to already exist')
        } else {
          t.fail(`Kinvey response: ${statusCode} ${data}`)
        }
      })
    })

  test('User Login', (t) => {
    t.timeoutAfter(kconfig.WIRE_TIMEOUT)
    let user = new Kinvey.User()
    return user.login(kconfig.testUser)
      .then((_user) => {
        const {data: {username}} = _user
        t.equal(username, kconfig.testUser.username,
          'Username must match')
        t.deepEqual(Kinvey.User.getActiveUser(), _user,
          'User must be set as active user')
      })
      .catch(({response: {statusCode, data}}) => {
          t.fail(`Kinvey response: ${statusCode} ${data}`)
      })
    })

  test('User Login repeat', (t) => {
    t.timeoutAfter(kconfig.WIRE_TIMEOUT)
    let user = new Kinvey.User()
    return user.login(kconfig.testUser)
      .then((_user) => {
        const {data: {username}} = _user
        t.equal(username, kconfig.testUser.username,
          'Username must match')
        t.deepEqual(Kinvey.User.getActiveUser(), _user,
          'User must be set as active user')
      })
      .catch((outcome) => {
        if (outcome.name == 'ActiveUserError') {
          t.pass('User expected to already be active')
        } else {
          t.fail(`Kinvey response: ${outcome}`)
        }
      })
    })

}
