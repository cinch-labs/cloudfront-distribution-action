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
  route53ZoneName: string,
  certificateARN: string,
  oaiARN: string,
) => Promise<void>

const createStack: CreateStack = async (
  region,
  stackName,
  bucketName,
  subdirectoryName,
  lambdaARN,
  route53ZoneID,
  route53ZoneName,
  certificateARN,
  oaiARN,
) => {
  try {
    console.log(
      region,
      stackName,
      bucketName,
      subdirectoryName,
      lambdaARN,
      route53ZoneID,
      route53ZoneName,
      certificateARN,
      oaiARN,
    )
  } catch (error) {
    core.setFailed(error)
  }
}

export { createStack }
