import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

const cloudFormation = new CloudFormation()

type GetCFStackStatus = (stackName: string) => Promise<string | undefined>

const getCFStackStatus: GetCFStackStatus = async (stackName) => {
  try {
    const availableStacks = await cloudFormation.listStackSets().promise()

    console.log(stackName)

    console.log('availableStacks', availableStacks)

    return 'status'
  } catch (error) {
    core.setFailed(error)
  }
}

export { getCFStackStatus }
