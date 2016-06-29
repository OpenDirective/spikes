import test from 'blue-tape'
import x from './reporter'

import testSDKAccess from './testSDKAccess'
//import testUser from './testUser'

const KILL_TIMEOUT = 3000

function runTests() {
  testSDKAccess()
//  testUser()
}

function execute() {
  runTests()

  // throwing forces browser-run to exit, else npm test hangs
//  setTimeout(() => {throw "exiting"}, KILL_TIMEOUT)
}

window.onload = execute
//execute()
