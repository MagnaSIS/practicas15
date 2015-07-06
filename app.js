/**  
 *   placeForMe -
 *   Copyright (C) 2015 by Magna SIS <magnasis@magnasis.com>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * Required Variables
 */

require('dotenv').load(); //Carga variables de entorno desde ficheros .env

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var partials = require('express-partials');
var methodOverride = require ('method-override');
/*
 * Define routes
 */
var routes = require('./routes/index');
var managerRoutes = require('./routes/manager');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//Set Application on development mode

//app.set('env', 'development');
//development || production

app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser("placeForMe"));
app.use(session({
	  secret: 'placeForMe Secrets xD',
	  resave: true,
	  saveUninitialized:true,
	  cookie: { maxAge: 3600000 } //Expira session tras 1h
	}));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



//Helpers dinamicos:
app.use(function(req, res, next) {

  // si no existe lo inicializa
  if (!req.session.redir) {
    req.session.redir = '/';
  }
  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout|\/user/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

app.use('/', routes);
app.use('/manager', managerRoutes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Página no encontrada');
  err.status = 404;
  next(err);
});

// error handlers

console.log(app.get('env'));

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  require('dotenv').load();
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	console.log("catch error...");
  res.status(err.status || 500);
 
  var errors=req.session.errors || {};
  req.session.errors={};
  
  res.render('error', {
	  message: err.message,
	  error: {}, 
	  errors: errors 
	  });
  
  
 /* res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });*/
  
});


module.exports = app;
