import test from 'tape'

test('Test test', (assert) => {
  const expected = 'test'
  const actual =  'test'

  assert.equal(actual, expected, 'this must pass')

  assert.end()
})
