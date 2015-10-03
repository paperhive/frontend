# PaperHive Frontend

[![Build Status](https://jenkins.paperhive.org/buildStatus/icon?job=frontend-staging)](https://jenkins.paperhive.org/job/frontend-staging/)
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
git clone git@github.com:paperhive/paperhive-frontend.git --recursive
cd paperhive-frontend
npm install
bower install
cp config.json.default config.json
```
Adapt `config.json` to your needs and finally run:
```
npm run build
```
Upon completion, the files for deployment are placed in the directory `build/`.

#### Static files
Make sure you passed `--recursive` to the clone command (see above). If you
switch branches and want to checkout the static files associated with the
current branch run
```
git submodule update
```

#### Development
Running
```
gulp serve
```
continuously builds the project (upon changes of the code) and fires up an HTTP server 
which can be reached via `http://localhost:8080`. For debugging purposes, gulp can be run with the 
environment variable `DEBUG=true` which omits all minimizations and includes source maps for
JavaScript and CSS. Note that this substantially speeds up the build process. So for development you
probably want to run
```
DEBUG=true gulp serve
```

#### Testing locally
Make sure that the frontend builds without errors,
```
npm run build
```
and that the selenium drivers are installed and up-to-date,
```
./node_modules/gulp-protractor/node_modules/.bin/webdriver-manager update
```
After that,
```
npm test
```
runs both unit and e2e tests.

## License
The PaperHive frontend is licensed under the [GPL3](https://www.gnu.org/licenses/gpl.html) license.
