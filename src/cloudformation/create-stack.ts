import * as core from '@actions/core'
// import { CloudFormation } from 'aws-sdk'

// const cloudFormation = new CloudFormation()

type CreateStack = (
  region: string,
  stackName: string,
  bucketName: string,
  subdirectoryName: string,
  lambdaARN: string,
  route53ZoneID: string,
  certificateARN: string,
  oaiARN: string,
  fullDomain: string,
) => Promise<void>

const createStack: CreateStack = async (
  region,
  stackName,
  bucketName,
  subdirectoryName,
  lambdaARN,
  route53ZoneID,
  certificateARN,
  oaiARN,
  fullDomain,
) => {
  try {
    console.log('region', region)
    console.log('stackName', stackName)
    console.log('bucketName', bucketName)
    console.log('subdirectoryName', subdirectoryName)
    console.log('lambdaARN', lambdaARN)
    console.log('route53ZoneID', route53ZoneID)
    console.log('certificateARN', certificateARN)
    console.log('oaiARN', oaiARN)
    console.log('fullDomain', fullDomain)
  } catch (error) {
    core.setFailed(error)
  }
}

export { createStack }
