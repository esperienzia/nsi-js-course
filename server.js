const express = require('express');
const moment = require('moment');

const APP = express();
APP.get('/', function (req, res) {
  res.send(`Express Server online - ${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}`);
});

APP.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});