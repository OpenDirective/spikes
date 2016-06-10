// import ping from 'kinvey'

import test from 'tape'

// setup for all tests]
import config from './kinvey-config'

function runTests () {
  console.debug(config)
  console.debug(Kinvey)

  test('init', (assert) => {
    const client = Kinvey.init(config);

    assert.equal(client instanceof Kinvey.client, true,
      'init should return a Client object')

    assert.end()
  })
}

window.onload = runTests

/*
example using blue-tape

test('Greet World', (assert) => new Promise((resolve) => {
  assert.equal(hello('World'), 'Hello, World!');

  setTimeout(() => {
    // do some async stuff
    resolve();
  }, 10);
}));
*/

