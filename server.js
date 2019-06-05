'use strict';

const express = require('express');
const moment = require('moment');

const APP = module.exports = express();

APP.get('/', function (req, res) {
  res.send(`Express Server online - ${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}`);
});

// start the server only if `$ node server.js`
if (require.main === module) {
  const PORT = Number(process.env.APP_PORT || 3000);
  APP.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`);
  });
}