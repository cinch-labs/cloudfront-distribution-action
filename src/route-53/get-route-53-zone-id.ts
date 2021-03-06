import * as core from '@actions/core'
import { Route53 } from 'aws-sdk'

const route53 = new Route53()

export const trimHostedZoneID = (input: string): string => {
  const arrayOfParts = input.split('/')
  return arrayOfParts[arrayOfParts.length - 1]
}

type GetRoute53ZoneID = (zoneName: string) => Promise<string | undefined>

const getRoute53ZoneID: GetRoute53ZoneID = async (zoneName) => {
  try {
    core.info(`Getting Route53ZoneID for '${zoneName}'...`)

    const hostedZonesByName = await route53.listHostedZonesByName({ DNSName: zoneName }).promise()
    const hostedZoneID = hostedZonesByName.HostedZones?.filter((zone) => zone.Name === `${zoneName}.`)[0]?.Id

    if (!hostedZoneID) {
      throw new Error(`No ID exists for Route53 zone name '${zoneName}'`)
    }

    const trimmedHostedZone = trimHostedZoneID(hostedZoneID)

    core.info(`Route53ZoneID is ${trimmedHostedZone}`)

    return trimHostedZoneID(trimmedHostedZone)
  } catch (error) {
    core.setFailed(error)
  }
}

export { getRoute53ZoneID }
