import * as core from '@actions/core'
import AWS from 'aws-sdk'

const route53 = new AWS.Route53()

type GetRoute53ZoneID = (zoneName: string) => Promise<string | undefined>

const getRoute53ZoneID: GetRoute53ZoneID = async (zoneName) => {
  try {
    const hostedZoneByName = await route53.listHostedZonesByName({ DNSName: zoneName }).promise()
    const hostedZoneID = hostedZoneByName.HostedZoneId

    if (!hostedZoneID) {
      core.setFailed('No hosted zone exists for the given Route53ZoneName')
    }

    return hostedZoneID
  } catch (error) {
    core.setFailed(error)
  }
}

export { getRoute53ZoneID }
