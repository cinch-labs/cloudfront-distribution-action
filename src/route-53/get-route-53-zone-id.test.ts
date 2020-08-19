import { trimHostedZoneID } from './get-route-53-zone-id'

describe('trimHostedZoneID', () => {
  it('trims the input correctly', () => {
    const input = '/hostedzone/Z09223422E1QOWP94PSHL'
    const expectedOutput = 'Z09223422E1QOWP94PSHL'

    expect(trimHostedZoneID(input)).toEqual(expectedOutput)
  })
})
