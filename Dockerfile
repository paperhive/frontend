FROM node:5.6.0

# init workspace
RUN mkdir /paperhive-frontend
WORKDIR /paperhive-frontend

# env var fixes excessive npm log output
# see https://github.com/nodejs/docker-node/issues/57
ENV NPM_CONFIG_LOGLEVEL="warn"

# let bower run as root
# http://bower.io/docs/api/#allow-root
ENV BOWER_ALLOW_ROOT="true"

# grab phantomjs from CDN (instead of rate-limited bitbucket)
#ENV PHANTOMJS_CDNURL="http://cnpmjs.org/downloads"

# copy dependency definitions and install them (may be cached!)
COPY package.json bower.json jspm.*.js typings.json /paperhive-frontend/
RUN npm run install-deps

# copy and build src
COPY . /paperhive-frontend
RUN npm run lint
RUN npm run build

# test when launching container with this image
CMD npm run test
