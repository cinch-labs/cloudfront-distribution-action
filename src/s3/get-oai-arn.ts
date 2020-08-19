import * as core from '@actions/core'
import { S3 } from 'aws-sdk'

const route53 = new S3()

type GetOaiArn = (bucketName: string) => Promise<string | undefined>

const getOaiArn: GetOaiArn = async (bucketName) => {
  try {
    const bucketPolicy = await route53.getBucketPolicy({ Bucket: bucketName }).promise()

    console.log('bucketPolicy.Policy', bucketPolicy.Policy)

    return ''
  } catch (error) {
    core.setFailed(error)
  }
}

export { getOaiArn }
