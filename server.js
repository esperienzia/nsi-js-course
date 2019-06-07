'use strict';

const express = require('express');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser')
const APP = module.exports = express();

if (require.main === module) {
  const PORT = Number(process.env.APP_PORT || 3000);
  APP.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`);
  });
}
APP.use(express.json());

APP.get('/', function (req, res) {

  res.send(`Express Server online - ${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}`);
});


APP.route('/notes')
   .get(function (req, res) {
     res.send('Get all books')
   })
   .post(function (req, res) {
     const ID = moment().unix();
     if (!req.body.note) {
       return res.status(400).send('Field note is required');
     }
     fs.writeFile(buildPath(ID), req.body.note,'utf8' ,(err, file) => {
       if (err) {
         return res.status(500).send('Something broke!');
       }
       res.statusCode = 200;
       res.setHeader('Content-Type', 'application/json');
       res.send(JSON.stringify({id: ID, note: req.body}));
     });
   })
   .delete(function (req, res) {
     res.send('Delete all the book')
   });

function buildPath(id) {
  const NOTES_FOLDER_NAME = 'notes';
  const PATH_ARRAY = [__dirname, NOTES_FOLDER_NAME];
  if (id) {
    PATH_ARRAY.push(id + '.txt');
  }
  return PATH_ARRAY.join(path.sep);
}

APP.route('/notes/:id')
   .get(function (req, res) {
     res.send('Get a single book')
   })
   .post(function (req, res) {
     res.send('Add a book')
   })
   .delete(function (req, res) {
     res.send('Update the book')
   })


// start the server only if `$ node server.js`
