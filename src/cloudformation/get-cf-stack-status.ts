import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

const cloudFormation = new CloudFormation()

type GetCFStackStatus = (stackName: string) => Promise<string | undefined>

const getCFStackStatus: GetCFStackStatus = async (stackName) => {
  try {
    const availableStacks = await cloudFormation.listStacks().promise()

    const testing = await cloudFormation
      .describeStacks({
        StackName:
          'arn:aws:cloudformation:eu-west-1:***:stack/inventory-soldevents-215101275-a/a738f270-e211-11ea-b1dd-02f0c9b42810',
      })
      .promise()

    console.log('TEST', testing)

    console.log(stackName)

    console.log('availableStacks', availableStacks)

    return 'status'
  } catch (error) {
    core.setFailed(error)
  }
}

export { getCFStackStatus }
