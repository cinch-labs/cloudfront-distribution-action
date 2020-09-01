import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

type GetLambdaARN = (lambdaStackName: string) => Promise<string | undefined>

const getLambdaARN: GetLambdaARN = async (lambdaStackName) => {
  try {
    const cloudFormation = new CloudFormation({ region: 'us-east-1' })

    if (lambdaStackName.length <= 0) {
      core.info('No lambda specified. Continuing without...')
      return lambdaStackName
    }

    core.info(`Getting ARN for Lambda '${lambdaStackName}'...`)

    const lambdaStackDescription = await cloudFormation.describeStacks({ StackName: lambdaStackName }).promise()

    if (!lambdaStackDescription.Stacks) {
      throw new Error(`No stacks associated with lambda '${lambdaStackName}'`)
    }

    const stackOutputs = lambdaStackDescription.Stacks[0].Outputs

    const lambdaARN = stackOutputs?.filter((output) => output.OutputKey === 'LambdaARN')[0]?.OutputValue

    if (!lambdaARN) {
      throw new Error(`No ARN can be found for the lambda ${lambdaStackName}`)
    }

    core.info(`Lambda ARN is ${lambdaARN}`)

    return lambdaARN
  } catch (error) {
    throw new Error(error)
  }
}

export { getLambdaARN }
