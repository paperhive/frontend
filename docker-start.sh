#!/bin/bash

set -eu
set -o pipefail

envsubst '$PRERENDER_TOKEN' < /frontend/templates/default.conf > /etc/nginx/conf.d/default.conf
envsubst '$PAPERHIVE_API_URL,$PAPERHIVE_BASE_HREF' < /frontend/templates/index.html > /frontend/html/index.html

exec nginx -g 'daemon off;'
