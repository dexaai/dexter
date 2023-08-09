#!/bin/bash

set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes

pnpm run build
pnpm changeset version
git add .
git commit -m "Publish updated packages"
pnpm changeset tag
git push
git push --tags
pnpm publish -r
