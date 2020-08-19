import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

const cloudFormation = new CloudFormation()

type GetCFStackStatus = (stackName: string) => Promise<string | undefined>

const getCFStackStatus: GetCFStackStatus = async (stackName) => {
  try {
    const cfStack = await cloudFormation.describeStacks({ StackName: stackName }).promise()

    console.log(cfStack)

    return 'status'
  } catch (error) {
    core.setFailed(error)
  }
}

export { getCFStackStatus }
