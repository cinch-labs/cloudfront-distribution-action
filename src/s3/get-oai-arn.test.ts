import { trimOaiArn } from './get-oai-arn'

describe('trimOaiArn', () => {
  it('trims the input correctly', () => {
    const input = 'arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity EV48J90FUJZ02'
    const expectedOutput = 'EV48J90FUJZ02'

    expect(trimOaiArn(input)).toEqual(expectedOutput)
  })
})
