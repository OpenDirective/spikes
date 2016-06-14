import test from 'blue-tape'
//import Kinvey from 'kinvey-html5-sdk'
//import {User} from 'kinvey-javascript-sdk-core/es5/user.js'
// Kinvey is a global script - see ../index.html

import config from './kinvey-config'

// Timeout for tests that wait for a reponse from Kinvey backend
const WIRE_TIMEOUT = 5000

export default function runTests () {
  // user tests
  test('No Initial Current user', (t) => {
    t.equal(Kinvey.User.getActiveUser(), null,
      'Active user should be null')
    t.end()
  })

  test('New user Signup', (t) => {
    t.timeoutAfter(WIRE_TIMEOUT)
    let user = new Kinvey.User()
    return user.signup(config.testUser)
      .then((_user) => {
        const {data: {username, password}} = _user
        t.deepEqual({username, password}, config.testUser,
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
    t.timeoutAfter(WIRE_TIMEOUT)
    let user = new Kinvey.User()
    return user.signup(config.suspendedUser)
      .then((_user) => {
        t.fail(`Should have failed`)
      })
      .catch((outcome) => {
        console.log(outcome)
        const {response: {statusCode, data}} = outcome
        if (JSON.parse(data).error === 'UserUnavailable') {
          t.pass('User expected to be unavailable')
        } else {
          t.fail(`Kinvey response: ${statusCode} ${data}`)
        }
      })
    })

  test('Locked user Signup', (t) => {
    t.timeoutAfter(WIRE_TIMEOUT)
    let user = new Kinvey.User()
    return user.signup(config.lockedUser)
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
    t.timeoutAfter(WIRE_TIMEOUT)
    let user = new Kinvey.User()
    return user.login(config.testUser)
      .then((_user) => {
        const {data: {username}} = _user
        t.equal(username, config.testUser.username,
          'Username should match')
        t.deepEqual(Kinvey.User.getActiveUser(), _user,
          'User sould be set as active user')
      })
      .catch(({response: {statusCode, data}}) => {
          t.fail(`Kinvey response: ${statusCode} ${data}`)
      })
    })

  test('User Login repeat', (t) => {
    t.timeoutAfter(WIRE_TIMEOUT)
    let user = new Kinvey.User()
    return user.login(config.testUser)
      .then((_user) => {
        const {data: {username}} = _user
        t.equal(username, config.testUser.username,
          'Username should match')
        t.deepEqual(Kinvey.User.getActiveUser(), _user,
          'User sould be set as active user')
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
