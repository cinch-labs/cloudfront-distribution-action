import * as core from '@actions/core'
import { CloudFormation } from 'aws-sdk'

const templateBody = `
---
AWSTemplateFormatVersion: '2010-09-09'
Description: Deploys a CloudFront Distribution using a subdirectory of an existing S3 bucket as origin
Parameters:
  BucketName:
    Type: String
    Description: Name of the bucket used as cloudfront origin.
  SubdirectoryName:
    Type: String
    Description: The name of the subdirectory to use as origin path
  Route53ZoneId:
    Type: String
    Description: Route53 Zone ID for hosted zone in Route53 for subdomain group
  CertificateARN:
    Type: String
    Description: ARN of wildcard certificate that covers subdomain we are adding
  WebsiteCloudFrontViewerRequestLambdaFunctionARN:
    Type: String
    Description: ARN of the Lambda@Edge function that provides basic auth and does rewriting of URLs (must be in us-east-1). See index.js
  OriginAccessIdentityARN:
    Type: String
    Description: ARN of the OAI allowing access to the bucket resources
  CloudFrontAlias:
    Type: String
    Description: Full domain name for CloudFront

Resources:
  WebsiteCloudfront:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Comment: !Ref 'SubdirectoryName'
        Origins:
          - DomainName: !Join ['', [!Ref BucketName, '.s3.amazonaws.com']]
            Id: s3origin
            OriginPath: !Join ['', ['/', !Ref SubdirectoryName]]
            S3OriginConfig:
              OriginAccessIdentity: !Join ['', ['origin-access-identity/cloudfront/', !Ref OriginAccessIdentityARN]]
        DefaultCacheBehavior:
          TargetOriginId: s3origin
          ViewerProtocolPolicy: redirect-to-https
          Compress: true
          MinTTL: 0
          DefaultTTL: 300
          MaxTTL: 300
          ForwardedValues:
            QueryString: true
          LambdaFunctionAssociations:
            - EventType: viewer-request
              LambdaFunctionARN: !Ref WebsiteCloudFrontViewerRequestLambdaFunctionARN
        Enabled: true
        HttpVersion: http2
        DefaultRootObject: index.html
        IPV6Enabled: true
        Aliases:
          - !Ref CloudFrontAlias
        ViewerCertificate:
          AcmCertificateArn: !Ref CertificateARN
          MinimumProtocolVersion: TLSv1.2_2018
          SslSupportMethod: sni-only
        CustomErrorResponses:
          - ErrorCode: 403
            ResponseCode: 404
            ResponsePagePath: '/error/index.html'
        PriceClass: PriceClass_100
      Tags:
        - Key: Name
          Value: !Join [' ', [!Ref BucketName, !Ref SubdirectoryName]]

  BranchWWWAlias:
    Type: AWS::Route53::RecordSet
    Properties:
      HostedZoneId: !Ref Route53ZoneId
      Name: !Ref CloudFrontAlias
      Type: A
      AliasTarget:
        HostedZoneId: Z2FDTNDATAQYW2 # Default/public - this is always the hostedZoneId for CloudFormation (see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget-1.html#cfn-route53-aliastarget-hostedzoneid)
        DNSName: !GetAtt WebsiteCloudfront.DomainName

Outputs:
  WebsiteCloudfront:
    Description: WebsiteCloudfront
    Value: !GetAtt WebsiteCloudfront.DomainName
  WebsiteAlias:
    Description: WebsiteAlias
    Value: !Ref CloudFrontAlias
`

type CreateStack = (
  region: string,
  stackName: string,
  bucketName: string,
  subdirectoryName: string,
  lambdaARN: string,
  route53ZoneID: string,
  certificateARN: string,
  oaiARN: string,
  fullDomain: string,
) => Promise<void>

const createStack: CreateStack = async (
  region,
  stackName,
  bucketName,
  subdirectoryName,
  lambdaARN,
  route53ZoneID,
  certificateARN,
  oaiARN,
  fullDomain,
) => {
  try {
    const cloudFormation = new CloudFormation({ region: region })

    const parameters: CloudFormation.Types.CreateStackInput = {
      Tags: [{ Key: 'branch', Value: stackName }],
      StackName: stackName,
      Parameters: [
        { ParameterKey: 'BucketName', ParameterValue: bucketName },
        { ParameterKey: 'SubdirectoryName', ParameterValue: subdirectoryName },
        { ParameterKey: 'Route53ZoneId', ParameterValue: route53ZoneID },
        { ParameterKey: 'CertificateARN', ParameterValue: certificateARN },
        { ParameterKey: 'WebsiteCloudFrontViewerRequestLambdaFunctionARN', ParameterValue: lambdaARN },
        { ParameterKey: 'OriginAccessIdentityARN', ParameterValue: oaiARN },
        { ParameterKey: 'CloudFrontAlias', ParameterValue: fullDomain },
      ],
      TemplateBody: templateBody,
    }

    await cloudFormation.createStack(parameters).promise()
  } catch (error) {
    core.setFailed(error)
  }
}

export { createStack }
