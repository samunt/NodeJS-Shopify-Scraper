let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const getResults = require("./scraper");

let app = express();

let admin = require("firebase-admin");
let serviceAccount = require("./on-scrape-firebase-adminsdk-qhq3k-e963c283df.json");

// initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://single-cistern-137723.firebaseio.com/"
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
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.post('/schedule', function (req, res) {
  res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
});

// self executing func to trigger the scraper
(async function() {
  await getResults();
})();

module.exports = app;

const port = 9000;
app.listen(port, () => console.log('App starting...'))
