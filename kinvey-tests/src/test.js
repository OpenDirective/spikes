import test from 'blue-tape'
//import Kinvey from 'kinvey-html5-sdk'
//import {User} from 'kinvey-javascript-sdk-core/es5/user.js'
// Kinvey is a global script - see ../index.html

import testSDKAccess from './testSDKAccess'
import testUser from './testUser'

const KILL_TIMEOUT = 3000

function runTests() {
  testSDKAccess()
  testUser()
}

function execute() {
  runTests()

  // throwing forces browser-run to exit, else npm test hangs
  setTimeout(() => {throw "exiting"}, KILL_TIMEOUT)
}

window.onload = execute
//execute()
