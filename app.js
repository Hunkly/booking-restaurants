var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const fs = require('fs');
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

app.get('/getData',urlencodedParser, function (req, res) {
  fs.readFile("booking.json", "utf8", function(error,data)
  {
    if(error) throw error; // если возникла ошибка
    console.log('Booking',JSON.parse(data));
    res.send(JSON.parse(data))
  });
});

app.post('/setData',urlencodedParser, function(req, res, next) {
  if(!req.body) return res.sendStatus(400);
  console.log('BODY',req.body);
  fs.writeFile("booking.json", JSON.stringify(req.body), function(error,data)
  {
    if(error) throw error; // если возникла ошибка
    console.log("Асинхронная запись файла завершена. Содержимое файла:");
    fs.readFile("booking.json", "utf8", function(error,data)
    {
      if(error) throw error; // если возникла ошибка
      console.log('Bookings ',JSON.parse(data));
      res.send(JSON.parse(data));
    });
  });

});


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

module.exports = app;
