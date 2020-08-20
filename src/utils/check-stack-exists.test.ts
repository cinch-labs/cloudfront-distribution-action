import { checkStackExists } from './check-stack-exists'

describe('checkStackExists', () => {
  it('returns true when the stack exists', () => {
    const input = {
      availableStacks: [
        {
          CreationTime: ('12ish' as unknown) as Date,
          StackName: 'llama',
          StackStatus: 'UPDATE_IN_PROGRESS',
        },
      ],
      stackName: 'llama',
    }
    const expectedOutput = true

    expect(checkStackExists(input.availableStacks, input.stackName)).toEqual(expectedOutput)
  })

  it('returns false when the stack does not exist', () => {
    const input = {
      availableStacks: [
        {
          CreationTime: ('12ish' as unknown) as Date,
          StackName: 'llama',
          StackStatus: 'UPDATE_IN_PROGRESS',
        },
      ],
      stackName: 'octopus',
    }
    const expectedOutput = false

    expect(checkStackExists(input.availableStacks, input.stackName)).toEqual(expectedOutput)
  })

  it('returns false when the stack is in DELETE_COMPLETE state', () => {
    const input = {
      availableStacks: [
        {
          CreationTime: ('12ish' as unknown) as Date,
          StackName: 'llama',
          StackStatus: 'DELETE_COMPLETE',
        },
      ],
      stackName: 'llama',
    }
    const expectedOutput = false

    expect(checkStackExists(input.availableStacks, input.stackName)).toEqual(expectedOutput)
  })
})
