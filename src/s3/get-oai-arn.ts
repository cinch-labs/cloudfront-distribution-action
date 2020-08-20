import * as core from '@actions/core'
import { S3 } from 'aws-sdk'

const route53 = new S3()

export const trimOaiArn = (input: string): string => {
  const arrayOfParts = input.split(' ')
  return arrayOfParts[arrayOfParts.length - 1]
}

type GetOaiArn = (bucketName: string) => Promise<string | undefined>

const getOaiArn: GetOaiArn = async (bucketName) => {
  try {
    core.info(`Getting OAI ARN for bucket '${bucketName}'...`)

    const bucketPolicy = await route53.getBucketPolicy({ Bucket: bucketName }).promise()

    if (!bucketPolicy.Policy) {
      throw new Error(`No policy exists for S3 bucket '${bucketName}'`)
    }

    const oaiArn = JSON.parse(bucketPolicy.Policy)?.Statement[0]?.Principal?.AWS

    if (!oaiArn) {
      throw new Error(`No principal ARN exists for S3 bucket '${bucketName}'`)
    }

    const trimmedOaiArn = trimOaiArn(oaiArn)

    core.info(`Bucket OAI ARN is ${trimmedOaiArn}`)

    return trimOaiArn(trimmedOaiArn)
  } catch (error) {
    core.setFailed(error)
  }
}

export { getOaiArn }
