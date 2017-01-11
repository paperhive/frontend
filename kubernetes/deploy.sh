#!/bin/bash

set -eu
set -o pipefail

# is this a pull request build? then don't deploy!
# NOTE: the decrypted secrets won't be available anyway if the PR comes from
#       another repository
if [ "${TRAVIS_PULL_REQUEST}" != "false"]; then
  echo "This is a pull request. Don't push or deploy."
  exit 0
fi


# sanitize branch name
export PAPERHIVE_BRANCH="${TRAVIS_BRANCH//[^a-zA-Z0-9\-_]/-}"
export PAPERHIVE_COMMIT="${TRAVIS_COMMIT:0:8}"
export PAPERHIVE_DOCKER_IMAGE="${DOCKER_IMAGE}"

# upload docker image
gcloud config set project paperhive-c0ff33
openssl aes-256-cbc -K $encrypted_90e3403db14e_key -iv $encrypted_90e3403db14e_iv -in gcloud-secret.json.enc -out gcloud-secret.json -d
gcloud auth activate-service-account --key-file gcloud-secret.json
gcloud docker -- push ${PAPERHIVE_DOCKER_IMAGE}

# install kubectl
gcloud -q components install kubectl

# remove old kubernetes resources (if any)
kubectl --namespace dev delete deployments,services,pods,ingresses -l branch=${PAPERHIVE_BRANCH}

# deploy new kubernetes resources
DIR=$(dirname $0)
for FILE in ${DIR}/*.yaml; do
  envsubst '$PAPERHIVE_BRANCH,$PAPERHIVE_COMMIT,$PAPERHIVE_DOCKER_IMAGE' < ${FILE} | kubectl create -f -
done
