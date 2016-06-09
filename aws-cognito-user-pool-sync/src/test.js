import makeAWSCognitoAuth from './auth-aws-cognito-user-pool'
import makeAWSCognitoSync from './sync-aws-cognito'

import test from 'tape'

// assumes we have users stephen / stephen and freddie / freddie
// The AWS code will keep the current user as persisted state - watch out!

const dispatchAuthAction = makeAWSCognitoAuth()
const dispatchSyncAction = makeAWSCognitoSync('brianUserData')

test('Test logout', (assert) => {
  dispatchAuthAction({action: 'signOut', username: 'stephen', password: 'stephen'}, (err, username) => {
    const expected = {err: null, username: null}
    const actual = {err, username}

    assert.deepEqual(actual, expected, 'For logout err and username should be null')

    assert.end()
  })
})

test('Test login with valid user', {timeout: 2000}, (assert) => {
  dispatchAuthAction({action: 'signIn', username: 'stephen', password: 'stephen'}, (err, username) => {
    const expected = {err: null, username: 'stephen'}
    const actual = {err, username}

    assert.deepEqual(actual, expected, 'For login err should be null and the username that supplied')

    assert.end()
  })
})

test('Test data get before set', (assert) => {
  dispatchSyncAction({action: 'get', key: 'config'}, (value) => {
    const expected = undefined
    const actual = value

    assert.equal(actual, expected, 'get should fail')

    assert.end()
  })
})

test('Test set and get', (assert) => {
  const payload = JSON.stringify({foo: 1, bar: ['a', {b: 'b'} ]})
  const key = 'config';
  dispatchSyncAction({action: 'set', key, value: payload})

  dispatchSyncAction({action: 'get', key}, (value) => {
    const expected = payload
    const actual = value

    assert.deepEqual(actual, expected, 'get should payload back')

    assert.end()
  })
})

test('Test logout', (assert) => {
  dispatchAuthAction({action: 'signOut', username: 'stephen', password: 'stephen'}, (err, username) => {
    const expected = {err: null, username: null}
    const actual = {err, username}

    assert.deepEqual(actual, expected, 'For logout err and username should be null')

    assert.end()
  })
})




