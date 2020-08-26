// import * as core from '@actions/core'
import { ACM, Response, AWSError } from 'aws-sdk'

import { getCertificateARN } from './get-certificate-arn'

jest.mock('aws-sdk')
// jest.mock('@actions/core')

const acmMock = (ACM as unknown) as jest.Mock

afterEach(() => {
  acmMock.mockClear()
})

describe('getCertificateARN', () => {
  const route53ZoneName = 'llamas.cinch.co.uk'
  const hasSubdomainPrefix = true

  const certificateARN = 'abc-123'

  it('returns the correct Certificate ARN when given a valid Route53 zone name and specifies subdomain prefix', async () => {
    const listCertificates = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        CertificateSummaryList: [
          {
            CertificateArn: certificateARN,
            DomainName: '*.llamas.cinch.co.uk',
          },
        ],
        $response: {} as Response<unknown, AWSError>,
      }),
    })

    acmMock.mockImplementationOnce(() => ({
      listCertificates,
    }))

    const actualResult = await getCertificateARN(route53ZoneName, hasSubdomainPrefix)
    const expectedResult = certificateARN

    expect(actualResult).toEqual(expectedResult)
  })
})
