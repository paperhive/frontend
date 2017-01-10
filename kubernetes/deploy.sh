#!/bin/bash

set -eu
set -o pipefail

# TODO: use dynamic values
export PAPERHIVE_BRANCH=test
export PAPERHIVE_COMMIT=52a2c49c

kubectl --namespace dev delete deployments,services,pods,ingresses -l branch=${PAPERHIVE_BRANCH}

DIR=$(dirname $0)
for FILE in ${DIR}/*.yaml; do
  envsubst '$PAPERHIVE_BRANCH,$PAPERHIVE_COMMIT' < ${FILE} | kubectl create -f -
done
