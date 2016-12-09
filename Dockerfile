FROM node:7

# init workspace
RUN mkdir /paperhive-frontend
WORKDIR /paperhive-frontend

# env var fixes excessive npm log output
# see https://github.com/nodejs/docker-node/issues/57
ENV NPM_CONFIG_LOGLEVEL="warn"

# grab phantomjs from CDN (instead of rate-limited bitbucket)
#ENV PHANTOMJS_CDNURL="http://cnpmjs.org/downloads"

# copy dependency definitions and install them (may be cached!)
COPY package.json /paperhive-frontend/
RUN npm install

# copy and build src
COPY . /paperhive-frontend
RUN npm run lint
RUN npm run build

# test when launching container with this image
CMD npm run test
