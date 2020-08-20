#!/usr/bin/env bash

url=$1
user=$2
password=$3

siteResponse=$(curl --user "$user:$password" "$url")
testString="This is a test site"

if [[ $siteResponse == *"$testString"* ]]; then
    exit 0
else
    exit 1
fi
