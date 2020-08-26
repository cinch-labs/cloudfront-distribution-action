import * as core from '@actions/core'
import { ACM } from 'aws-sdk'

const acm = new ACM({ region: 'us-east-1' })

type GetCertificateARN = (route53ZoneName: string, certificateHasWildcardPrefix: boolean) => Promise<string | undefined>

const getCertificateARN: GetCertificateARN = async (route53ZoneName, certificateHasWildcardPrefix) => {
  try {
    core.info(`Getting Certificate ARN for Route53Zone '${route53ZoneName}'...`)

    console.log(acm)

    const certificates = await acm.listCertificates().promise()

    const certificateDomainFromInput = certificateHasWildcardPrefix ? `*.${route53ZoneName}` : route53ZoneName

    const certificateARN = certificates.CertificateSummaryList?.filter(
      (certificate) => certificate?.DomainName === certificateDomainFromInput,
    )[0]?.CertificateArn

    if (!certificateARN) {
      throw new Error(`No ARN can be found for domain '${route53ZoneName}'`)
    }

    core.info(`Certificate ARN is ${certificateARN}`)

    return certificateARN
  } catch (error) {
    core.error(error)
  }
}

export { getCertificateARN }
