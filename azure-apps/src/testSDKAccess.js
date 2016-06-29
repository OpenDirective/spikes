import test from 'blue-tape'
import azureMA from 'azure-mobile-apps-client'

export default function runTests () {
  test('Azure Mobile Apps Client creation', t => {
    const client = new azureMA.MobileServiceClient(location.origin);

    t.ok(client instanceof azureMA.MobileServiceClient,
         'A MobileServiceClient must be returned')
    t.comment(`Client Version: ${client.version}`)
    t.end()
  })

  test('Table access', t => {
    const client = new azureMA.MobileServiceClient(location.origin);
    const tableName = 'todoitem'
    const table = client.getTable(tableName)

    const expected = "MobileServiceTable"
    const actual = table.constructor.name
    t.equal(actual, expected,
         'A MobileServiceTable must be returned')

    const expected2 = tableName
    const actual2 = table.getTableName()
    t.equal(actual2, expected2,
        `Table name must be "${tableName}"`);
    t.end()
  })

}
