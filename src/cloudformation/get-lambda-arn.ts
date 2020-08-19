import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

const cloudFormation = new CloudFormation({ region: 'us-east-1' })

type GetLambdaARN = (lambdaStackName: string) => Promise<string | undefined>

const getLambdaARN: GetLambdaARN = async (lambdaStackName) => {
  try {
    const lambdaStackDescription = await cloudFormation.describeStacks({ StackName: lambdaStackName }).promise()
    console.log(lambdaStackDescription)

    return 'lambdaStackDescription'
  } catch (error) {
    core.setFailed(error)
  }
}

export { getLambdaARN }
