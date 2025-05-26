#! bin/bash

tar -czf app.tar.gz dist package.json pnpm-lock.yaml
aws s3 cp app.tar.gz s3://$BUCKET_NAME/
