import * as core from '@actions/core'
import { ACM } from 'aws-sdk'

const acm = new ACM({ region: 'us-east-1' })

type GetCertificateARN = (route53ZoneName: string) => Promise<string | undefined>

const getCertificateARN: GetCertificateARN = async (route53ZoneName) => {
  try {
    const certificates = await acm.listCertificates().promise()

    console.log(route53ZoneName)
    console.log('certificates', certificates)

    return ''
  } catch (error) {
    core.setFailed(error)
  }
}

export { getCertificateARN }
