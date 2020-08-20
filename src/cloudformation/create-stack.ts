import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

import { loadYaml, checkStackExists } from '../utils'

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
    core.info(`Creating/updating stack '${stackName}'...`)

    const cloudFormation = new CloudFormation({ region: region })

    const templateBody = loadYaml('/cloudfront-distribution.yml')

    const parameters: CloudFormation.Types.CreateStackInput = {
      Tags: [{ Key: 'branch', Value: stackName }],
      StackName: stackName,
      Parameters: [
        { ParameterKey: 'BucketName', ParameterValue: bucketName },
        { ParameterKey: 'SubdirectoryName', ParameterValue: subdirectoryName },
        { ParameterKey: 'Route53ZoneId', ParameterValue: route53ZoneID },
        { ParameterKey: 'CertificateARN', ParameterValue: certificateARN },
        { ParameterKey: 'WebsiteCloudFrontViewerRequestLambdaFunctionARN', ParameterValue: lambdaARN },
        { ParameterKey: 'OriginAccessIdentityARN', ParameterValue: oaiARN },
        { ParameterKey: 'CloudFrontAlias', ParameterValue: fullDomain },
      ],
      TemplateBody: templateBody,
    }

    const availableStacks = (await cloudFormation.listStacks().promise()).StackSummaries
    const stackExists = checkStackExists(availableStacks, stackName)

    if (stackExists) {
      core.info(`Stack '${stackName}' already exists. Continuing...`)
    } else {
      core.info(`Creating stack with name '${stackName}'...`)
      await cloudFormation.createStack(parameters).promise()

      await cloudFormation.waitFor('stackCreateComplete', { StackName: stackName }).promise()
      core.info(`Completed stack creation for '${stackName}'`)
    }
  } catch (error) {
    core.setFailed(error)
  }
}

export { createStack }
