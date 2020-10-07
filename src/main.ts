import * as core from '@actions/core'

import { Input } from './types'

import { checkInputContent, getFullDomain } from './utils'
import { getRoute53ZoneID } from './route-53'
import { getOaiArn } from './s3'
import { getCFStackStatus, waitForStack, getLambdaARN, createStack } from './cloudformation'
import { getCertificateARN } from './acm'

async function run(): Promise<void> {
  try {
    const cfStackName = checkInputContent(core.getInput(Input.CLOUDFORMATION_STACK_NAME), Input.CLOUDFORMATION_STACK_NAME)
    const viewerRequestLambdaStackName =
      core.getInput(Input.VIEWER_REQUEST_LAMBDA_STACK_NAME).length > 0
        ? core.getInput(Input.VIEWER_REQUEST_LAMBDA_STACK_NAME)
        : core.getInput(Input.LAMBDA_STACK_NAME)
    const originResponseLambdaStackName = core.getInput(Input.ORIGIN_RESPONSE_LAMBDA_STACK_NAME)
    const route53ZoneName = checkInputContent(core.getInput(Input.ROUTE_53_ZONE_NAME), Input.ROUTE_53_ZONE_NAME)
    const s3BucketName = checkInputContent(core.getInput(Input.S3_BUCKET_NAME), Input.S3_BUCKET_NAME)
    const subdirectoryName = checkInputContent(core.getInput(Input.SUBDIRECTORY_NAME), Input.SUBDIRECTORY_NAME)
    const awsRegion = checkInputContent(core.getInput(Input.AWS_REGION), Input.AWS_REGION)
    const subdomainPrefix = core.getInput(Input.SUBDOMAIN_PREFIX)

    const route53ZoneID = await getRoute53ZoneID(route53ZoneName)
    const oaiArn = await getOaiArn(s3BucketName)
    const viewerRequestLambdaARN = await getLambdaARN(viewerRequestLambdaStackName)
    const originResponseLambdaARN = await getLambdaARN(originResponseLambdaStackName)
    const certificateARN = await getCertificateARN(route53ZoneName, subdomainPrefix.length >= 1)
    const stackStatus = await getCFStackStatus(cfStackName)

    await waitForStack(stackStatus!, cfStackName)

    await createStack(
      awsRegion,
      cfStackName,
      s3BucketName,
      subdirectoryName,
      viewerRequestLambdaARN!,
      originResponseLambdaARN!,
      route53ZoneID!,
      certificateARN!,
      oaiArn!,
      getFullDomain(subdomainPrefix, route53ZoneName),
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
