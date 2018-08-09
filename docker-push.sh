#!/bin/bash

set -eu
set -o pipefail

if [ "${TRAVIS_PULL_REQUEST}" != "false" ]; then
  echo "This is a pull request. Don't push."
  exit 0
fi

if [ -z "${TRAVIS_TAG}" ]; then
  echo "This is not a tag build. Don't push."
  exit 0
fi

# gcloud key
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -

# gcloud sdk repo
echo "deb https://packages.cloud.google.com/apt cloud-sdk-$(lsb_release -c -s) main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

# install gcloud
sudo apt-get update && sudo apt-get install google-cloud-sdk

# init gcloud auth
gcloud config set project paperhive-c0ff33
openssl aes-256-cbc -K $encrypted_90e3403db14e_key -iv $encrypted_90e3403db14e_iv -in gcloud-secret.json.enc -out gcloud-secret.json -d
gcloud auth activate-service-account --key-file gcloud-secret.json
gcloud auth configure-docker --quiet

DOCKER_PREFIX="gcr.io/paperhive-c0ff33"
DOCKER_TAG="${TRAVIS_TAG#v}"

DOCKER_IMAGE_SOURCE="frontend"
DOCKER_IMAGE_TARGET="${DOCKER_PREFIX}/${DOCKER_IMAGE_SOURCE}:${DOCKER_TAG}"
docker tag ${DOCKER_IMAGE_SOURCE} ${DOCKER_IMAGE_TARGET}
docker push ${DOCKER_IMAGE_TARGET}
