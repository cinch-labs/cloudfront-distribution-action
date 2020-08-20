import { CloudFormation } from 'aws-sdk'

type StackExists = (availableStacks: CloudFormation.StackSummaries | undefined, stackName: string) => boolean

const checkStackExists: StackExists = (availableStacks, stackName) => {
  if (!availableStacks) {
    throw new Error(`No stacks available for '${stackName}'`)
  }

  return availableStacks.some((stack) => stack.StackName === stackName && stack.StackStatus !== 'DELETE_COMPLETE')
}

export { checkStackExists }
