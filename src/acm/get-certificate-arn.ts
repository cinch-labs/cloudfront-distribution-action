import * as core from '@actions/core'
import { ACM } from 'aws-sdk'

const acm = new ACM({ region: 'us-east-1' })

type GetCertificateARN = (route53ZoneName: string) => Promise<string | undefined>

const getCertificateARN: GetCertificateARN = async (route53ZoneName) => {
  try {
    const certificates = await acm.listCertificates().promise()

    const certificateARN = certificates.CertificateSummaryList?.filter(
      (certificate) => certificate.DomainName === route53ZoneName,
    )[0]?.CertificateArn

    console.log(route53ZoneName)
    console.log('certificateARN', certificateARN)

    if (!certificateARN) {
      throw new Error(`No ARN can be found for domain '${route53ZoneName}'`)
    }

    return certificateARN
  } catch (error) {
    core.setFailed(error)
  }
}

export { getCertificateARN }
