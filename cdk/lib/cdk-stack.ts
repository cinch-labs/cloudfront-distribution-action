import { Construct, StackProps, Stack, CfnParameter } from '@aws-cdk/core'
import { Bucket } from '@aws-cdk/aws-s3'

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const uploadBucketName = new CfnParameter(this, 'uploadBucketName', {
      type: 'String',
      description: 'The name of the Amazon S3 bucket where uploaded files will be stored.',
    })

    new Bucket(this, 'MyFirstBucket', {
      bucketName: uploadBucketName.valueAsString,
    })
  }
}
