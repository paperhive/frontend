# PaperHive Frontend

test

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

#### Deployment
**Always** check the following:

1. Do the [unit tests](https://travis-ci.org/paperhive/paperhive-frontend) of your branch pass?
2. Have you tested the [deployed branch](https://paperhive.org/dev/frontend/) *manually*?

You can deploy the branch by following these steps:

1. Clone the deployment repo if you haven't cloned it yet:

   ```git clone git@github.com:paperhive/paperhive-frontend-deploy.git```

2. Check out the current deployment master:

    ```(cd paperhive-frontend-deploy/ && git checkout master && git pull)```

3. Make a clean build

    ```rm -rf tmp build node_modules bower_components && npm install && bower install && gulp```

4. Copy the resulting files: 

    ```rsync -a --delete --exclude .git build/ paperhive-frontend-deploy/```

5. Commit and push:

    ```(cd paperhive-frontend-deploy/ && git add . && git commit -a && git push)```

6. Change the `revision` in the puppet config (`puppet/manifests/nodes.pp`) to the commit you just made to `paperhive-frontend-deploy`. Commit, push, pull and apply.

## License
The PaperHive frontend is licensed under the [GPL3](https://www.gnu.org/licenses/gpl.html) license.
