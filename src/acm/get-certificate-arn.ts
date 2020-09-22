import * as core from '@actions/core'
import { ACM } from 'aws-sdk'

const acm = new ACM({ region: 'us-east-1' })

type GetCertificateARN = (route53ZoneName: string, certificateName: string) => Promise<string | undefined>

const getCertificateARN: GetCertificateARN = async (certificateName, route53ZoneName) => {
  try {
    core.info(`Getting Certificate ARN for Route53Zone '${route53ZoneName}'...`)

    const certificates = await acm.listCertificates().promise()

    const certificateARN = certificates.CertificateSummaryList?.filter(
      (certificate) => certificate.DomainName === certificateName,
    )[0]?.CertificateArn

    if (!certificateARN) {
      throw new Error(`No ARN can be found for domain '${route53ZoneName}'`)
    }

    core.info(`Certificate ARN is ${certificateARN}`)

    return certificateARN
  } catch (error) {
    core.setFailed(error)
  }
}

export { getCertificateARN }
