import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

const cloudFormation = new CloudFormation()

type GetCFStackStatus = (stackName: string) => Promise<string | undefined>

const getCFStackStatus: GetCFStackStatus = async (stackName) => {
  try {
    const availableStacks = await cloudFormation.listStacks().promise()

    const testing = await cloudFormation.describeStacks({ StackName: 'inventory-specdataevents-215101275-a' }).promise()

    console.log('TEST', testing)

    console.log(stackName)

    console.log('availableStacks', availableStacks)

    return 'status'
  } catch (error) {
    core.setFailed(error)
  }
}

export { getCFStackStatus }
