// import * as core from '@actions/core'
// import { CloudFormation, Response, AWSError } from 'aws-sdk'

// import { getCertificateARN } from './get-certificate-arn'

// jest.mock('aws-sdk')
// jest.mock('@actions/core')

// const cloudFormationMock = (CloudFormation as unknown) as jest.Mock

// afterEach(() => {
//   cloudFormationMock.mockClear()
// })

// describe('getCertificateARN', () => {
//   const stackName = 'stack-of-llamas'
//   const lambdaARN = 'abc123'

//   it('returns the correct Certificate ARN when given a valid Route53 zone name', async () => {
//     const describeStacks = jest.fn().mockReturnValue({
//       promise: jest.fn().mockResolvedValue({
//         Stacks: [
//           {
//             StackName: stackName,
//             StackStatus: 'CREATE_IN_PROGRESS',
//             CreationTime: new Date(),
//             Outputs: [
//               {
//                 OutputKey: 'LambdaARN',
//                 OutputValue: lambdaARN,
//               },
//             ],
//           },
//         ],
//         $response: {} as Response<unknown, AWSError>,
//       }),
//     })

//     cloudFormationMock.mockImplementationOnce(() => ({
//       describeStacks,
//     }))

//     const actualResult = await getCertificateARN(stackName)
//     const expectedResult = lambdaARN

//     expect(actualResult).toEqual(expectedResult)
//     expect(core.info).toBeCalledWith(`Getting ARN for Lambda '${stackName}'...`)
//     expect(core.info).toBeCalledWith(`Lambda ARN is ${lambdaARN}`)
//   })
// })
