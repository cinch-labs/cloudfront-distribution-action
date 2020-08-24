import AWS from 'aws-sdk'
// import { mock, when, instance } from 'ts-mockito'

import { getLambdaARN } from './get-lambda-arn'

describe('getLambdaARN', () => {
  it('works ffs', async () => {
    // const mockedCloudFormation = mock(CloudFormation)
    // const cloudFormation = instance(mockedCloudFormation)

    const ssmGetParameterPromise = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Parameter: {
          Name: 'NAME',
          Type: 'SecureString',
          Value: 'VALUE',
          Version: 1,
          LastModifiedDate: 1546551668.495,
          ARN: 'arn:aws:ssm:ap-southeast-2:123:NAME',
        },
      }),
    })

    AWS.SSM = jest.fn().mockImplementation(() => ({
      getParameter: ssmGetParameterPromise,
    }))

    when(cloudFormation.describeStacks).thenReturn()

    await getLambdaARN('input')

    expect(cloudFormation.describeStacks).toBeCalled()
  })
})
