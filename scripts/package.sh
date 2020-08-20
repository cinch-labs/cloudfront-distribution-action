#!/usr/bin/env bash

ncc build --source-map
cp "./src/templates/cloudfront-distribution.yml" "./dist/cloudfront-distribution.yml"
