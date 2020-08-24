import { CloudFormation } from 'aws-sdk'

import { getLambdaARN } from './get-lambda-arn'

jest.mock('aws-sdk')

describe('getLambdaARN', () => {
  it('works ffs', async () => {
    const stackName = 'stack-of-llamas'
    const lambdaARN = 'abc123'

    const describeStacksPromise = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Stacks: [
          {
            StackName: stackName,
            StackStatus: 'CREATE_IN_PROGRESS',
            CreationTime: new Date(),
            Outputs: [
              {
                OutputKey: 'LambdaARN',
                OutputValue: lambdaARN,
              },
            ],
          },
        ],
        $response: null as any,
      }),
    })

    ;(CloudFormation as any).mockImplementation(() => ({
      describeStacks: describeStacksPromise,
    }))

    const actualResult = await getLambdaARN(stackName)

    const expectedResult = lambdaARN

    expect(actualResult).toEqual(expectedResult)
  })
})
