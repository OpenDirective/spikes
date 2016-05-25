import AWSCONFIG from './aws-config'

/* global AWS, AWSCognito */

export default function makeAWSCognitoSyncImpl(dataSet) {

  function _get(key, value, callback) {
  AWS.config.region = AWSCONFIG.SyncIdentityRegion
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWSCONFIG.SyncIdentityPool
    })

    AWS.config.credentials.get(() => {
      const client = new AWS.CognitoSyncManager()
      client.openOrCreateDataset(dataSet, (err, dataset) => {
        if (err) {
          console.error('Cognito sync error - Dataset', err)
          callback(undefined)
          return
        }
        dataset.get(key, (err, value) => {
          if (err) {
            console.error('Cognito sync error - get', err)
            callback(undefined)
            return
          }
          callback(value)
        })
      })
    })
  }

  function _set(key, value, callback) {
    AWS.config.region = AWSCONFIG.SyncIdentityRegion
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWSCONFIG.SyncIdentityPool
    })

    AWS.config.credentials.get(() => {
      const syncManager = new AWS.CognitoSyncManager()
      syncManager.openOrCreateDataset(dataSet, (err, dataset) => {
        if (err) {
          console.error('Cognito sync error - Dataset', err)
          callback(undefined)
          return
        }
        dataset.put(key, value, (err, value) => {
          if (err) {
            console.error('Cognito sync error - Put', err)
            // callback(undefined)
            return
          }
        })
      })
    })
  }


  function _sync(key, value, callback) {
    AWS.config.region = AWSCONFIG.SyncIdentityRegion
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWSCONFIG.SyncIdentityPool
    })

    AWS.config.credentials.get(() => {
      const syncManager = new AWS.CognitoSyncManager()

      syncManager.openOrCreateDataset(dataSet, (err, dataset) => {
        dataset.synchronize({

          onSuccess: (dataset, newRecords) => {
            console.info('sync ok', dataset, newRecords)
          },

          onFailure: (err) => {
            console.error('sync fail', err)
          },

          onConflict: (dataset, conflicts, callbackConflict) => {
            var resolved = []``

            for (var i = 0; i < conflicts.length; ++i) {
              // Take remote version.
              resolved.push(conflicts[i].resolveWithRemoteRecord())

              // Or... take local version.
              // resolved.push(conflicts[i].resolveWithLocalRecord())

              // Or... use custom logic.
              // var newValue = conflicts[i].getRemoteRecord().getValue() + conflicts[i].getLocalRecord().getValue()
              // resolved.push(conflicts[i].resolveWithValue(newValue)
            }

            dataset.resolve(resolved, () => {
              console.error('sync resolved', err)
              return callbackConflict(true)
            })

            // Or... callbackConflict false to stop the synchronization process.
            // return callbackConflict(false)
          },

          onDatasetDeleted: (dataset, datasetName, callbackDelete) => {
            // Return true to delete the local copy of the dataset.
            // Return false to handle deleted datasets outsid ethe synchronization callback.
            console.error('sync del', err)
            return callbackDelete(true)
          },

          onDatasetMerged: (dataset, datasetNames, callbackMerge) => {

            // Return true to continue the synchronization process.
            // Return false to handle dataset merges outside the synchroniziation callback.
            console.error('sync merge', err)
            return callbackMerge(false)
          }
        })
      })
    })
  }


  const handlers = {_get, _set, _sync}

  return function dispatchSyncAction({action, key, value}, callback) {
    try {
      handlers[`_${action}`](key, value, callback)
    } catch (err) {
      throw new Error(`AWSCognitoSync: unknown action - ${err}`)
    }
  }
}
