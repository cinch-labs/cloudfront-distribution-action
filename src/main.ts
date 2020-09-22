import * as core from '@actions/core'

import { Input } from './types'

import { checkInputContent } from './utils'
import { getRoute53ZoneID } from './route-53'
import { getOaiArn } from './s3'
import { getCFStackStatus, waitForStack, getLambdaARN, createStack } from './cloudformation'
import { getCertificateARN } from './acm'

async function run(): Promise<void> {
  try {
    const cfStackName = checkInputContent(core.getInput(Input.CLOUDFORMATION_STACK_NAME), Input.CLOUDFORMATION_STACK_NAME)
    const lambdaStackName = core.getInput(Input.LAMBDA_STACK_NAME)
    const route53ZoneName = checkInputContent(core.getInput(Input.ROUTE_53_ZONE_NAME), Input.ROUTE_53_ZONE_NAME)
    const s3BucketName = checkInputContent(core.getInput(Input.S3_BUCKET_NAME), Input.S3_BUCKET_NAME)
    const subdirectoryName = checkInputContent(core.getInput(Input.SUBDIRECTORY_NAME), Input.SUBDIRECTORY_NAME)
    const awsRegion = checkInputContent(core.getInput(Input.AWS_REGION), Input.AWS_REGION)
    const webAclId = core.getInput(Input.WEB_ACL_ID)
    const certificateName = core.getInput(Input.CERTIFICATE_NAME)
    const aRecordName = core.getInput(Input.A_RECORD_NAME)
    const cloudFrontAliases = core.getInput(Input.CLOUDFRONT_ALIASES)

    const route53ZoneID = await getRoute53ZoneID(route53ZoneName)
    const oaiArn = await getOaiArn(s3BucketName)
    const lambdaARN = await getLambdaARN(lambdaStackName)
    const certificateARN = await getCertificateARN(certificateName)
    const stackStatus = await getCFStackStatus(cfStackName)

    await waitForStack(stackStatus!, cfStackName)

    await createStack(
      awsRegion,
      cfStackName,
      s3BucketName,
      subdirectoryName,
      lambdaARN!,
      route53ZoneID!,
      certificateARN!,
      oaiArn!,
      webAclId!,
      aRecordName,
      cloudFrontAliases,
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
