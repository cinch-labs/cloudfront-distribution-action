import * as core from '@actions/core'

import { Input } from './types'

import { checkInputContent } from './utils'
import { getRoute53ZoneID } from './route-53'
import { getOaiArn } from './s3'
import { getCFStackStatus, waitForStack, getLambdaARN } from './cloudformation'
import { getCertificateARN } from './acm'

async function run(): Promise<void> {
  try {
    const cfStackName = checkInputContent(core.getInput(Input.CLOUDFORMATION_STACK_NAME), Input.CLOUDFORMATION_STACK_NAME)
    const lambdaStackName = checkInputContent(core.getInput(Input.LAMBDA_STACK_NAME), Input.LAMBDA_STACK_NAME)
    const route53ZoneName = checkInputContent(core.getInput(Input.ROUTE_53_ZONE_NAME), Input.ROUTE_53_ZONE_NAME)
    const s3BucketName = checkInputContent(core.getInput(Input.S3_BUCKET_NAME), Input.S3_BUCKET_NAME)
    // const subdirectoryName = checkInputContent(core.getInput(Input.SUBDIRECTORY_NAME), Input.SUBDIRECTORY_NAME)
    // const awsRegion = checkInputContent(core.getInput(Input.AWS_REGION), Input.AWS_REGION)

    const route53ZoneID = await getRoute53ZoneID(route53ZoneName)
    const oaiArn = await getOaiArn(s3BucketName)
    const lambdaARN = await getLambdaARN(lambdaStackName)
    const certificateARN = await getCertificateARN(route53ZoneName)
    const stackStatus = await getCFStackStatus(cfStackName)

    console.log('route53ZoneID', route53ZoneID)
    console.log('oaiArn', oaiArn)
    console.log('lambdaARN', lambdaARN)
    console.log('certificateARN', certificateARN)
    console.log('stackStatus', stackStatus)

    waitForStack(stackStatus!)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
