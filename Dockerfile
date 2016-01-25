FROM node:5.4.1

COPY package.json /tmp/
COPY bower.json /tmp/

# init user
RUN useradd -s /bin/sh -d /home/node -m node && \
  chown node:node /tmp/package.json /tmp/bower.json
USER node

# init workspace
RUN mkdir /home/node/workspace
WORKDIR /home/node/workspace

# env var fixes excessive npm log output
# see https://github.com/nodejs/docker-node/issues/57
ENV NPM_CONFIG_LOGLEVEL="warn"


RUN cd /tmp; \
  npm install && \
  ./node_modules/.bin/bower install && \
  rm -rf node_modules bower_components package.json bower.json

CMD npm run build
