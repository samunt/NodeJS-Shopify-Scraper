const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const getResults = require('./scraper');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccount.json');

// initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // TODO Change the link to your firebase link
  databaseURL: 'https://myfirebaselink.firebaseio.com/'
});



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  //TODO change the environment if you want
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.post('/schedule', function (req, res) {
  res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
});

// self executing func to trigger the scraper
// can also trigger
(function() {
  getResults();
})();

module.exports = app;

const port = 9000;
app.listen(port, () => console.log('STARTING...'))
