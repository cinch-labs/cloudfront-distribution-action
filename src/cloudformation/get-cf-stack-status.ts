import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

import { StackStatus } from './types'

const cloudFormation = new CloudFormation()

type GetCFStackStatus = (stackName: string) => Promise<StackStatus | undefined>

const getCFStackStatus: GetCFStackStatus = async (stackName) => {
  try {
    const availableStacks = (await cloudFormation.listStacks().promise()).StackSummaries
    const stackExists = availableStacks?.some((stack) => stack.StackName === stackName)

    if (!stackExists) {
      return StackStatus.DOES_NOT_EXIST
    }

    const stackDescription = await cloudFormation.describeStacks({ StackName: stackName }).promise()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stackStatus = stackDescription.Stacks![0].StackStatus

    return stackStatus as StackStatus
  } catch (error) {
    core.setFailed(error)
  }
}

export { getCFStackStatus }
