# Cloudfront distribution action

Creates a CloudFront distribution that points to a subdirectory of an S3 bucket.

## Usage

```yaml
- name: Creation a Cloudfront distribution
  uses: cinch-labs/cloudfront-distribution-action@main
  with:
    cloudformation-stack-name: stack-name
    lambda-stack-name: lambda-stack-name
    route-53-zone-name: cinch.co.uk
    s3-bucket-name: bucket-name
    subdirectory-name: subdirectory-name
    aws-region: eu-west-1
    subdomain-prefix: subdomain
```

## API

### `cloudformation-stack-name`

**Required**: `true`

This is the name given to your CloudFormation stack when it's created.

The stack name is an identifier that helps you find a particular stack from a list of stacks. A stack name can contain only alphanumeric characters (case-sensitive) and hyphens. It must start with an alphabetic character and can't be longer than 128 characters.

### `cloudfront-aliases`

**Required**: `true`

A comma separated list of the aliases to associate with the cloudfront distribution. The first item in the list will be used as the output of the action.

### `a-record-name`

**Required**: `false`

The name of the A record to be created if required.

### `lambda-stack-name`

**Required**: `false`

This is the name of the lambda@edge that sits in front of your CloudFront distribution and handles requests. This is not required if you don't need URL rewrites or basic authentication.

### `route-53-zone-name`

**Required**: `true`

This is the name of the zone that routes to your deployment. It must already exist in AWS and it is used to create your CloudFront distribution as well as determining which SSL certificate to use.

### `s3-bucket-name:`

**Required**: `true`

This is the name of the S3 bucket that your site is deployed to. You will also need to specify a `subdirectory-name`.

### `subdirectory-name`

**Required**: `true`

This is the name of the subdirectory of the S3 bucket that your site is deployed to. The S3 bucket itself is specified with `s3-bucket-name`.

### `aws-region`

**Required**: `true`

This is the AWS region used when creating your CloudFormation stack. It must be one of the following [AWS regions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html).

### `subdomain-prefix`

**Required**: `false`

This is required if your deployment requires prefixing your Route53 zone with a subdomain. If you specify this, your SSL certificate will have a wildcard prefix.

### `certificate-name`

**Required**: `false`

This is required if your deployment requires manually specifying a certificate name. Should not be needed in most cases.

### `web-acl-id`

**Required**: `false`

The Web ACL ID - see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-distributionconfig.html#cfn-cloudfront-distribution-distributionconfig-webaclid for full information on this parameter.

## Development

Install the dependencies

```bash
$ npm install
```

Build and package the action for distribution

```bash
$ npm run build && npm run package
```

## Publish

1. Start work on a new branch. If you want to test your changes in a live scenario you can reference your branch's version of the action in the consuming workflow as follows:

```yaml
uses: cinch-labs/cloudfront-distribution-action@your-branch-name
```

2. When you have finished your work, compile the action for release\* and push those changes:

```bash
  npm run build
  npm run package
```

<sub>\* These two commands are also run automatically as a git pre-commit hook</sub>

3. Open a PR and, when the checks pass, merge it into `main`.

4. Congratulations your changes are now live!
