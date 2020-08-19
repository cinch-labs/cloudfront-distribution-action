import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

const cloudFormation = new CloudFormation()

type GetCFStackStatus = (stackName: string) => Promise<string | undefined>

const getCFStackStatus: GetCFStackStatus = async (stackName) => {
  try {
    const availableStacks = (await cloudFormation.listStacks().promise()).StackSummaries

    const inputStackExists = availableStacks?.some((stack) => stack.StackName === stackName)

    if (!inputStackExists) {
      throw new Error('stack does not exist')
    }

    const inputStackDescription = await cloudFormation.describeStacks({ StackName: stackName }).promise()

    console.log('inputStackDescription', inputStackDescription)

    return 'status'
  } catch (error) {
    core.setFailed(error)
  }
}

export { getCFStackStatus }
