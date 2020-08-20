import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

import { StackStatus } from './types'

const cloudFormation = new CloudFormation()

const setWaitingInfo = (stackName: string, status: StackStatus) =>
  core.info(`Waiting for stack '${stackName}' to finish '${status}'...`)

const setCompleteInfo = (status: StackStatus) => core.info(`'${status}' complete`)

type WaitForStack = (stackStatus: StackStatus, stackName: string) => Promise<void>

const waitForStack: WaitForStack = async (stackStatus, stackName) => {
  try {
    const isUnrecoverable =
      stackStatus === StackStatus.UPDATE_ROLLBACK_FAILED ||
      stackStatus === StackStatus.DELETE_FAILED ||
      stackStatus === StackStatus.ROLLBACK_COMPLETE

    if (isUnrecoverable) {
      core.setFailed('CloudFormation stack is in an unrecoverable state. Please fix or delete the stack manually.')
    }

    if (stackStatus === StackStatus.CREATE_IN_PROGRESS) {
      setWaitingInfo(stackName, StackStatus.CREATE_IN_PROGRESS)
      await cloudFormation.waitFor('stackCreateComplete', { StackName: stackName }).promise()
      setCompleteInfo(StackStatus.CREATE_IN_PROGRESS)
    }
    if (stackStatus === StackStatus.UPDATE_IN_PROGRESS) {
      setWaitingInfo(stackName, StackStatus.UPDATE_IN_PROGRESS)
      await cloudFormation.waitFor('stackUpdateComplete', { StackName: stackName }).promise()
      setCompleteInfo(StackStatus.UPDATE_IN_PROGRESS)
    }
    if (stackStatus === StackStatus.DELETE_IN_PROGRESS) {
      setWaitingInfo(stackName, StackStatus.DELETE_IN_PROGRESS)
      await cloudFormation.waitFor('stackDeleteComplete', { StackName: stackName }).promise()
      setCompleteInfo(StackStatus.DELETE_IN_PROGRESS)
    }
  } catch (error) {
    core.setFailed(error)
  }
}

export { waitForStack }
