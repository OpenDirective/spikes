// AWS Config - is git ignored for privacy

const _AWSCONFIG = {
  // Note Amazon's Pascal casing of names
  IdentityRegion: 'eu-west-1',
  IdentityPoolId: 'eu-west-1:23f3754f-d6d3-47da-af70-5eb83441d510',

  UserPoolRegion: 'us-east-1',
  UserPoolId: 'us-east-1_A2HeABQfl',
  ClientId: '7m5nr6pgpe7en26q55jnic16t6',

  SyncIdentityRegion: 'eu-west-1',
  SyncIdentityPool: 'eu-west-1:23f3754f-d6d3-47da-af70-5eb83441d510'
//  SyncIdentityPool: 'eu-west-1:bf784d6e-f55a-4725-84e2-b15e6d2e46d5'
}

// Slightly messy way to get round lack of self reference in obj literals
const AWSCONFIG = {..._AWSCONFIG, loginCredentials: `cognito-idp.${_AWSCONFIG.IdentityRegion}.amazonaws.com/${_AWSCONFIG.UserPoolId}`}

export default AWSCONFIG
