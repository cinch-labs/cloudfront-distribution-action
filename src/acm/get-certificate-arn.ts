import * as core from '@actions/core'
import { ACM } from 'aws-sdk'

const acm = new ACM({ region: 'us-east-1' })

type GetCertificateARN = (certificateName: string) => Promise<string | undefined>

const getCertificateARN: GetCertificateARN = async (certificateName) => {
  try {
    core.info(`Getting ARN for certificate '${certificateName}'...`)

    const certificates = await acm.listCertificates().promise()

    const certificateARN = certificates.CertificateSummaryList?.filter((certificate) => {
      console.log(certificate.DomainName)

      return certificate.DomainName === certificateName
    })[0]?.CertificateArn

    if (!certificateARN) {
      throw new Error(`No ARN can be found for certificate '${certificateName}'`)
    }

    core.info(`Certificate ARN is ${certificateARN}`)

    return certificateARN
  } catch (error) {
    core.setFailed(error)
  }
}

export { getCertificateARN }
