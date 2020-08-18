import { getRoute53ZoneID } from './get-route-53-zone-id'

describe('getRoute53ZoneID', () => {
  it('getRoute53ZoneID', () => {
    getRoute53ZoneID('prod.cinch.co.uk')
  })
})
