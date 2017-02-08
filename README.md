# PaperHive Frontend

[![Greenkeeper badge](https://badges.greenkeeper.io/paperhive/paperhive-frontend.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/paperhive/paperhive-frontend.svg?branch=master)](https://travis-ci.org/paperhive/paperhive-frontend)
[![Dependency Status](https://gemnasium.com/paperhive/paperhive-frontend.svg)](https://gemnasium.com/paperhive/paperhive-frontend)
[![Sauce Labs Status](https://badges.herokuapp.com/sauce/paperhive?name=PaperHive&tag=master&source=api)](https://saucelabs.com/u/paperhive)
---

### Setup
#### Requirements
* nodejs and npm (included in nodejs): the easies way to install nodejs is via
  [nvm](https://github.com/creationix/nvm)

#### Build
```
git clone git@github.com:paperhive/paperhive-frontend.git --recursive
cd paperhive-frontend
npm install
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

#### Atom packages

The following atom packages are recommended:

* atom-typescript
* linter-tslint
* linter-eslint

#### Development
Running
```
npm run watch
```
continuously builds the project (upon changes of the code) and fires up an HTTP server
which can be reached via `http://localhost:8080`.

#### Testing locally
Make sure that the frontend builds without errors,
```
npm run build
```
and that the selenium drivers are installed and up-to-date,
```
`npm bin`/webdriver-manager update
```
After that,
```
npm test
```
runs both unit and e2e tests.

## License
The PaperHive frontend is licensed under the [GPL3](https://www.gnu.org/licenses/gpl.html) license.
