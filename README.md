# PaperHub Frontend

### Setup
#### Requirements
* nodejs
* npm
* bower
* gulp

#### Build
```
git@github.com:paperhub/paperhub-frontend.git
cd paperhub-frontend
npm install
bower install
gulp
```
The resulting files for deployment are placed in the directory `build/`.

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
