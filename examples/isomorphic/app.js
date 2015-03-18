var React = require('react');
var Router = require('react-router');

var appConfig = require('./react/src/config');

var request = require('superagent');
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var browserify = require('connect-browserify');

var Conflux = require('../../');
var actions = require('./react/src/actions');
var stores = require('./react/src/stores');

var App = require('./react/src/app');
var initializeRoutes = require('./utils/initializeRoutes');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/search/:query', function(req, res) {
  request.get(appConfig.REMOTE_API_HOST + '/api/search/?api_key=' + appConfig.GIANT_BOMB_API_KEY + '&format=json&resources=game&resource_type=game&query=' + req.params.query + '&field_list=name,image,id').end(function(data) {
    res.set('Content-Type', 'application/json');
    res.send(data.body);
  });
});

app.get('/api/game/:game_id', function(req, res) {
  request.get(appConfig.REMOTE_API_HOST + '/api/game/' + req.params.game_id + '/?api_key=' + appConfig.GIANT_BOMB_API_KEY + '&format=json&field_list=name,image,id,similar_games,deck').end(function(data) {
    res.set('Content-Type', 'application/json');
    res.send(data.body);
  });
});

app.get('/app.js', browserify({
  entry: path.resolve(__dirname, './react/src/app'),
  debug: true,
  watch: true,
  extensions: ['.js', '.jsx']
}));

app.use(function(req, res, next) {
  if(req.query.q) {
    return res.redirect('/search/' + req.query.q);
  }

  var flux = Conflux(actions, stores);

  Router.run(App.routes, req.url, function(Handler, state){
    flux.actions.setRouteState(state);

    initializeRoutes(state.routes, state, flux)
      .then(() => {
        var str = React.renderToString(<Handler flux={flux} state={flux.serialize()}/>);
        res.send('<!DOCTYPE html>' + str.replace('%document_title_placeholder%', App.title.rewind()));
      })
      .catch(next);
  });
});

// handle errors
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).send({
    message: err.message,
    fileName: err.fileName,
    lineNumber: err.lineNumber,
    error: err.stack
  });
});

module.exports = app;
