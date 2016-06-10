import test from 'tape'

document.addEventListener('DOMContentLoaded', () => {
  // do your setup here
  console.log('Initialized app');
	test('Test test', (assert) => {
	  const expected = 'test'
	  const actual =  'test'

	  assert.equal(actual, expected, 'this must pass')

	  assert.end()
	})
});
