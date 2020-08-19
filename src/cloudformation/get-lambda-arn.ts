import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

const cloudFormation = new CloudFormation({ region: 'us-east-1' })

type GetLambdaARN = (lambdaStackName: string) => Promise<string | undefined>

const getLambdaARN: GetLambdaARN = async (lambdaStackName) => {
  try {
    const lambdaStackDescription = await cloudFormation.describeStacks({ StackName: lambdaStackName }).promise()

    if (!lambdaStackDescription.Stacks) {
      throw new Error(`No stacks associated with lambda '${lambdaStackName}'`)
    }

    const stackOutputs = lambdaStackDescription.Stacks[0].Outputs

    console.log('stackOutputs', stackOutputs)

    return 'lambdaStackDescription'
  } catch (error) {
    core.setFailed(error)
  }
}

export { getLambdaARN }
