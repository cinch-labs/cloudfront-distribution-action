import { getCertificateName } from './get-certificate-arn'

describe('getCertificateName', () => {
  it('returns the certificate name when explicitly given one', () => {
    const initialValue = {
      certificateName: 'a-name.com',
      certificateHasWildcardPrefix: false,
      route53ZoneName: '',
    }
    const expectedResult = initialValue.certificateName

    expect(
      getCertificateName(initialValue.certificateName, initialValue.certificateHasWildcardPrefix, initialValue.route53ZoneName),
    ).toEqual(expectedResult)
  })

  it('returns a wildcard certificate name when wildcard prefix parameter is true', () => {
    const initialValue = {
      certificateName: '',
      certificateHasWildcardPrefix: true,
      route53ZoneName: 'dog.cat.com',
    }
    const expectedResult = `*.${initialValue.route53ZoneName}`

    expect(
      getCertificateName(initialValue.certificateName, initialValue.certificateHasWildcardPrefix, initialValue.route53ZoneName),
    ).toEqual(expectedResult)
  })

  it('does not return a wildcard certificate name when wildcard prefix parameter is false', () => {
    const initialValue = {
      certificateName: '',
      certificateHasWildcardPrefix: false,
      route53ZoneName: 'cat.dog.com',
    }
    const expectedResult = `${initialValue.route53ZoneName}`

    expect(
      getCertificateName(initialValue.certificateName, initialValue.certificateHasWildcardPrefix, initialValue.route53ZoneName),
    ).toEqual(expectedResult)
  })
})
