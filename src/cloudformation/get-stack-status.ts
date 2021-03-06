import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

import { StackStatus } from './types'
import { checkStackExists } from '../utils'

const cloudFormation = new CloudFormation()

type GetCFStackStatus = (stackName: string) => Promise<StackStatus | undefined>

const getCFStackStatus: GetCFStackStatus = async (stackName) => {
  try {
    core.info(`Getting CloudFormation stack status for stack '${stackName}'...`)

    const availableStacks = (await cloudFormation.listStacks().promise()).StackSummaries
    const stackExists = checkStackExists(availableStacks, stackName)

    if (!stackExists) {
      return StackStatus.DOES_NOT_EXIST
    }

    const stackDescription = await cloudFormation.describeStacks({ StackName: stackName }).promise()
    const stackStatus = stackDescription.Stacks![0].StackStatus

    core.info(`Stack status is ${stackStatus}`)

    return stackStatus as StackStatus
  } catch (error) {
    core.setFailed(error)
  }
}

export { getCFStackStatus }
