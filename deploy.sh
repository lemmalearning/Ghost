#!/bin/bash

rm -rf core/built

grunt prod

tar -zcvf ghost-built.tar.gz core/built
gsutil cp ghost-built.tar.gz gs://lm-assets/

git push google master -f

#gcloud container builds submit --config cloudbuild.yaml .
