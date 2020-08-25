#!/usr/bin/env bash

subdomainPrefix=$1
githubSha=$2

echo "$subdomainPrefix-${githubSha:0:10}"
