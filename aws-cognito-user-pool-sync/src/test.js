import makeAWSCognitoAuthImpl from './auth-aws-cognito-user-pool'
//import {set, get, sync} from './sync-aws-cognito'

import test from 'tape'

// assumes we have users stephen / stephen and freddie / freddie
// The AWS code will keep the current user as persisted state - watch out!

const dispatchAuthAction = makeAWSCognitoAuthImpl()

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

    assert.end();
  })
})

