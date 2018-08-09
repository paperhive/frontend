# PaperHive Frontend

[![Build Status](https://travis-ci.org/paperhive/paperhive-frontend.svg?branch=master)](https://travis-ci.org/paperhive/paperhive-frontend)
[![Sauce Labs Status](https://badges.herokuapp.com/sauce/paperhive?name=PaperHive&tag=master&source=api)](https://saucelabs.com/u/paperhive)
---

### Setup
#### Requirements
* nodejs and npm (included in nodejs): the easies way to install nodejs is via
  [nvm](https://github.com/creationix/nvm)

#### Configuration

The build (`npm run build`) and development (`npm run watch`) scripts respect
these optional environment variables that you might want to change:

* `PAPERHIVE_API_URL` (optional): the PaperHive API to use.
  Defaults to `https://dev.paperhive.org/master`.
* `PAPERHIVE_BASE_HREF` (optional): the base path where the frontend is
  served. Defaults to `/`.

#### Build
```
git clone git@github.com:paperhive/paperhive-frontend.git --recursive
cd paperhive-frontend
npm install
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
