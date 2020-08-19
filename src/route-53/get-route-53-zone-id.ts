import * as core from '@actions/core'
import { Route53 } from 'aws-sdk'

const route53 = new Route53()

type GetRoute53ZoneID = (zoneName: string) => Promise<string | undefined>

const getRoute53ZoneID: GetRoute53ZoneID = async (zoneName) => {
  try {
    const hostedZonesByName = await route53.listHostedZonesByName({ DNSName: zoneName }).promise()
    const hostedZoneID = hostedZonesByName.HostedZones?.filter((zone) => zone.Name === `${zoneName}.`)[0]?.Id

    if (!hostedZoneID) {
      core.setFailed('No ID exists for the given Route53ZoneName')
    }

    return hostedZoneID
  } catch (error) {
    core.setFailed(error)
  }
}

export { getRoute53ZoneID }
