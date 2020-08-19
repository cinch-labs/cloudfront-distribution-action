import { getFullDomain } from './get-full-domain'

describe('getFullDomain', () => {
  it('returns just the zone name when given an empty prefix', () => {
    const prefix = ''
    const zoneName = 'dog.cat.com'
    expect(getFullDomain(prefix, zoneName)).toEqual(zoneName)
  })

  it('returns a combination of zone name and prefix when given a prefix', () => {
    const prefix = 'eagle'
    const zoneName = 'dog.cat.com'
    expect(getFullDomain(prefix, zoneName)).toEqual(`${prefix}.${zoneName}`)
  })
})
