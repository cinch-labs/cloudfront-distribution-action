#!/usr/bin/env bash

bucketName=$1
subdirectoryName=$2

aws s3 rm "s3://${bucketName}/${subdirectoryName}" --recursive
