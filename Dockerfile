FROM node:5.4.1

# init workspace
RUN mkdir /paperhive-frontend
WORKDIR /paperhive-frontend

# env var fixes excessive npm log output
# see https://github.com/nodejs/docker-node/issues/57
ENV NPM_CONFIG_LOGLEVEL="warn"

# let bower run as root
# http://bower.io/docs/api/#allow-root
ENV BOWER_ALLOW_ROOT="true"

# copy dependency definitions and install them (may be cached!)
COPY package.json /paperhive-frontend/
COPY bower.json /paperhive-frontend/
RUN npm run install-deps

# copy and build src
COPY . /paperhive-frontend
RUN npm run build

# test when launching container with this image
CMD npm run test
