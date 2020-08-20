import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

import { StackStatus } from './types'

const cloudFormation = new CloudFormation()

const setWaitingInfo = (stackName: string, status: StackStatus) =>
  core.info(`Waiting for '${stackName}' to finish '${status}'...`)

const setCompleteInfo = (status: StackStatus) => core.info(`'${status}' complete`)

const setContinuingInfo = (status: StackStatus) =>
  status === StackStatus.DOES_NOT_EXIST
    ? core.info('Stack does not exist yet. Continuing...')
    : core.info(`Stack status is in ${status} state. Continuing...`)

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

    setContinuingInfo(stackStatus)
  } catch (error) {
    core.setFailed(error)
  }
}

export { waitForStack }
