# PaperHive Frontend

[![Build
Status](https://travis-ci.org/paperhive/paperhive-frontend.svg?branch=master)](https://travis-ci.org/paperhive/paperhive-frontend)
[![Dependency Status](https://gemnasium.com/paperhive/paperhive-frontend.svg)](https://gemnasium.com/paperhive/paperhive-frontend)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/nschloe.svg)](https://saucelabs.com/u/nschloe)

---

### Setup
#### Requirements
* nodejs
* npm
* bower
* gulp

#### Build
```
git clone git@github.com:paperhive/paperhive-frontend.git
cd paperhive-frontend
npm install
bower install
cp config.json.default config.json
```
Adapt `config.json` to your needs and finally run:
```
gulp
```
Upon completion, the files for deployment are placed in the directory `build/`.

#### Development
Running
```
gulp serve
```
continuously builds the project (upon changes of the code) and fires up an HTTP server 
which can be reached via `http://localhost:8080`. For debugging purposes, gulp can be run with the 
environment variable `DEBUG=true` which omits all minimizations and includes sourcemaps for
javascript and css. Note that this substantially speeds up the build process. So for development you 
probably want to run
```
DEBUG=true gulp serve
```
