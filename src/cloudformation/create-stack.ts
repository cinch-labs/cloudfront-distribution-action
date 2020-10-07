import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

import { loadYaml, getArrayFromCommaString } from '../utils'

type CreateStack = (
  region: string,
  stackName: string,
  bucketName: string,
  subdirectoryName: string,
  viewerRequestLambdaARN: string,
  originResponseLambdaARN: string,
  route53ZoneID: string,
  certificateARN: string,
  oaiARN: string,
  webAclId: string,
  aRecordName: string,
  cloudFrontAliases: string,
) => Promise<void>

const createStack: CreateStack = async (
  region,
  stackName,
  bucketName,
  subdirectoryName,
  viewerRequestLambdaARN,
  originResponseLambdaARN,
  route53ZoneID,
  certificateARN,
  oaiARN,
  webAclId,
  aRecordName,
  cloudFrontAliases,
) => {
  try {
    const cloudFormation = new CloudFormation({ region: region })

    const templateBody = loadYaml('/cloudfront-distribution.yml')
    const stackNameWithTimestamp = `${stackName}-${Math.floor(Date.now() / 1000)}`

    const parameters: CloudFormation.Types.CreateStackInput = {
      Tags: [{ Key: 'label', Value: stackNameWithTimestamp }],
      StackName: stackName,
      Parameters: [
        { ParameterKey: 'BucketName', ParameterValue: bucketName },
        { ParameterKey: 'SubdirectoryName', ParameterValue: subdirectoryName },
        { ParameterKey: 'Route53ZoneId', ParameterValue: route53ZoneID },
        { ParameterKey: 'CertificateARN', ParameterValue: certificateARN },
        { ParameterKey: 'WebsiteCloudFrontViewerRequestLambdaFunctionARN', ParameterValue: viewerRequestLambdaARN },
        { ParameterKey: 'WebsiteCloudFrontOriginResponseLambdaFunctionARN', ParameterValue: originResponseLambdaARN },
        { ParameterKey: 'OriginAccessIdentityARN', ParameterValue: oaiARN },
        { ParameterKey: 'WebACLId', ParameterValue: webAclId },
        { ParameterKey: 'CloudFrontAliases', ParameterValue: cloudFrontAliases },
        { ParameterKey: 'ARecordName', ParameterValue: aRecordName },
      ],
      TemplateBody: templateBody,
    }

    try {
      await cloudFormation.updateStack(parameters).promise()

      await cloudFormation.waitFor('stackUpdateComplete', { StackName: stackName }).promise()

      core.info(`Updated stack '${stackName}'`)
    } catch (error) {
      core.info(`Creating stack with name '${stackName}'...`)

      await cloudFormation.createStack(parameters).promise()
      await cloudFormation.waitFor('stackCreateComplete', { StackName: stackName }).promise()

      core.info(`Completed stack creation for '${stackName}'`)
    }

    const outputURL = `https://${getArrayFromCommaString(cloudFrontAliases)[0]}`

    core.setOutput('url', outputURL)
  } catch (error) {
    core.setFailed(error)
  }
}

export { createStack }
