import * as core from '@actions/core'
import { CloudFormation, Response, AWSError } from 'aws-sdk'

import { getLambdaARN } from './get-lambda-arn'

jest.mock('aws-sdk')
jest.mock('@actions/core')

const cloudFormationMock = (CloudFormation as unknown) as jest.Mock

afterEach(() => {
  cloudFormationMock.mockClear()
})

describe('getLambdaARN', () => {
  const stackName = 'stack-of-llamas'
  const lambdaARN = 'abc123'

  it('returns the correct LambdaARN when given a valid stack name', async () => {
    const describeStacks = jest.fn().mockReturnValue({
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
        $response: {} as Response<unknown, AWSError>,
      }),
    })

    cloudFormationMock.mockImplementationOnce(() => ({
      describeStacks,
    }))

    const actualResult = await getLambdaARN(stackName)
    const expectedResult = lambdaARN

    expect(actualResult).toEqual(expectedResult)
    expect(core.info).toBeCalledWith(`Getting ARN for Lambda '${stackName}'...`)
    expect(core.info).toBeCalledWith(`Lambda ARN is ${lambdaARN}`)
  })

  it('throws an error when there are no stacks listed for the given stack name', async () => {
    const describeStacks = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Stacks: undefined,
        $response: {} as Response<unknown, AWSError>,
      }),
    })

    cloudFormationMock.mockImplementationOnce(() => ({
      describeStacks,
    }))

    await expect(getLambdaARN(stackName)).rejects.toThrowError(`No stacks associated with lambda '${stackName}'`)
  })

  it('throws an error when there is no LambdaARN for the given stack name', async () => {
    const describeStacks = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Stacks: [
          {
            StackName: stackName,
            StackStatus: 'CREATE_IN_PROGRESS',
            CreationTime: new Date(),
            Outputs: [],
          },
        ],
        $response: {} as Response<unknown, AWSError>,
      }),
    })

    cloudFormationMock.mockImplementationOnce(() => ({
      describeStacks,
    }))

    await expect(getLambdaARN(stackName)).rejects.toThrowError(`No ARN can be found for the lambda ${stackName}`)
  })

  it('returns an empty string when given an empty string', async () => {
    const actualResult = await getLambdaARN('')
    const expectedResult = ''

    expect(actualResult).toEqual(expectedResult)
    expect(core.info).toBeCalledWith('No lambda specified. Continuing without...')
  })
})
