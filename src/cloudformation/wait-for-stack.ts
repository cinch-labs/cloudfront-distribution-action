import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

import { StackStatus } from './types'

const cloudFormation = new CloudFormation()

type WaitForStack = (stackStatus: StackStatus) => Promise<void>

const setWaitingInfo = (status: StackStatus) => core.info(`Waiting for stack status '${status}' to complete`)
const setCompleteInfo = (status: StackStatus) => core.info(`'${status}' complete`)

const waitForStack: WaitForStack = async (stackStatus) => {
  try {
    const isUnrecoverable =
      stackStatus === StackStatus.UPDATE_ROLLBACK_FAILED ||
      stackStatus === StackStatus.DELETE_FAILED ||
      stackStatus === StackStatus.ROLLBACK_COMPLETE

    if (isUnrecoverable) {
      core.setFailed('CloudFormation stack is in an unrecoverable state. Please fix or delete the stack manually.')
    }

    if (stackStatus === StackStatus.CREATE_IN_PROGRESS) {
      setWaitingInfo(StackStatus.CREATE_IN_PROGRESS)
      await cloudFormation.waitFor('stackCreateComplete').promise()
      setCompleteInfo(StackStatus.CREATE_IN_PROGRESS)
    }
    if (stackStatus === StackStatus.UPDATE_IN_PROGRESS) {
      setWaitingInfo(StackStatus.UPDATE_IN_PROGRESS)
      await cloudFormation.waitFor('stackUpdateComplete').promise()
      setCompleteInfo(StackStatus.UPDATE_IN_PROGRESS)
    }
    if (stackStatus === StackStatus.DELETE_IN_PROGRESS) {
      setWaitingInfo(StackStatus.DELETE_IN_PROGRESS)
      await cloudFormation.waitFor('stackDeleteComplete').promise()
      setCompleteInfo(StackStatus.DELETE_IN_PROGRESS)
    }

    core.info(`Stack status is ${stackStatus}, continuing...`)
  } catch (error) {
    core.setFailed(error)
  }
}

export { waitForStack }
