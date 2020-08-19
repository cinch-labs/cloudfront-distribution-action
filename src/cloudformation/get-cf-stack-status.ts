import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

const cloudFormation = new CloudFormation()

type GetCFStackStatus = (stackName: string) => Promise<string | undefined>

const getCFStackStatus: GetCFStackStatus = async (stackName) => {
  try {
    const availableStacks = (await cloudFormation.listStacks().promise()).StackSummaries
    const stackExists = availableStacks?.some((stack) => stack.StackName === stackName)

    if (!stackExists) {
      throw new Error('Stack does not exist for given CloudFormationStackName')
    }

    const stackDescription = await cloudFormation.describeStacks({ StackName: stackName }).promise()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stackStatus = stackDescription.Stacks![0].StackStatus

    return stackStatus
  } catch (error) {
    core.setFailed(error)
  }
}

export { getCFStackStatus }
