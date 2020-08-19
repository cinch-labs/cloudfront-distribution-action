import * as core from '@actions/core'
import { S3 } from 'aws-sdk'

const route53 = new S3()

type GetOaiArn = (bucketName: string) => Promise<string | undefined>

const getOaiArn: GetOaiArn = async (bucketName) => {
  try {
    const bucketPolicy = await route53.getBucketPolicy({ Bucket: bucketName }).promise()

    if (!bucketPolicy.Policy) {
      throw new Error(`No policy exists for S3 bucket '${bucketName}'`)
    }

    const arn = JSON.parse(bucketPolicy.Policy)?.Statement[0]?.Principal?.AWS

    if (!arn) {
      throw new Error(`No principal ARN exists for S3 bucket '${bucketName}'`)
    }

    return arn
  } catch (error) {
    core.setFailed(error)
  }
}

export { getOaiArn }
