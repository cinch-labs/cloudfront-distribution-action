import * as core from '@actions/core'

import { Input } from './types'

import { checkInputContent } from './utils'
import { getRoute53ZoneID } from './route-53'

async function run(): Promise<void> {
  try {
    const cfStackName = checkInputContent(core.getInput(Input.CLOUDFORMATION_STACK_NAME), Input.CLOUDFORMATION_STACK_NAME)
    const lambdaStackName = checkInputContent(core.getInput(Input.LAMBDA_STACK_NAME), Input.LAMBDA_STACK_NAME)
    const route53ZoneName = checkInputContent(core.getInput(Input.ROUTE_53_ZONE_NAME), Input.ROUTE_53_ZONE_NAME)
    const s3BucketName = checkInputContent(core.getInput(Input.S3_BUCKET_NAME), Input.S3_BUCKET_NAME)
    const subdirectoryName = checkInputContent(core.getInput(Input.SUBDIRECTORY_NAME), Input.SUBDIRECTORY_NAME)
    const awsRegion = checkInputContent(core.getInput(Input.AWS_REGION), Input.AWS_REGION)

    console.log(cfStackName)
    console.log(lambdaStackName)
    console.log(route53ZoneName)
    console.log(s3BucketName)
    console.log(subdirectoryName)
    console.log(awsRegion)

    const zoneID = await getRoute53ZoneID(route53ZoneName)

    console.log(zoneID)

    core.info(`ZONE_ID IS ${zoneID}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
