#!/bin/bash

rm -rf core/built
rm -rf core/client/dist

grunt prod

tar -zcvf ghost-built.tar.gz core/built core/server/admin/views core/server/public/ghost-sdk.min.js core/server/public/ghost.min.css
gsutil cp ghost-built.tar.gz gs://lm-assets/

git push google master -f
