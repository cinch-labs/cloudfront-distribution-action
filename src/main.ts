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
    const lambdaStackName = core.getInput(Input.LAMBDA_STACK_NAME)
    const route53ZoneName = checkInputContent(core.getInput(Input.ROUTE_53_ZONE_NAME), Input.ROUTE_53_ZONE_NAME)
    const s3BucketName = checkInputContent(core.getInput(Input.S3_BUCKET_NAME), Input.S3_BUCKET_NAME)
    const subdirectoryName = checkInputContent(core.getInput(Input.SUBDIRECTORY_NAME), Input.SUBDIRECTORY_NAME)
    const awsRegion = checkInputContent(core.getInput(Input.AWS_REGION), Input.AWS_REGION)
    const subdomainPrefix = core.getInput(Input.SUBDOMAIN_PREFIX)
    const webAclId = core.getInput(Input.WEB_ACL_ID)
    const certificateName = core.getInput(Input.CERTIFICATE_NAME)
    const requiresARecord = core.getInput(Input.REQUIRES_A_RECORD) === 'false' ? 'false' : 'true'

    const route53ZoneID = await getRoute53ZoneID(route53ZoneName)
    const oaiArn = await getOaiArn(s3BucketName)
    const lambdaARN = await getLambdaARN(lambdaStackName)
    const certificateARN = await getCertificateARN(certificateName, subdomainPrefix.length >= 1, route53ZoneName)
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
      getFullDomain(subdomainPrefix, route53ZoneName),
      webAclId!,
      requiresARecord,
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
