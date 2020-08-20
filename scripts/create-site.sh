#!/usr/bin/env bash

bucketName=$1
subdirectoryName=$2

createTestSite() {
    mkdir public
    cat >./public/index.html <<'EOF'
<h1> Test site</h1>
    <p>
        This is a test site
    </p>
EOF
}

createTestSite

aws s3 sync ./public "s3://${bucketName}/${subdirectoryName}"
