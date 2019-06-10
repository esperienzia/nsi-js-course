'use strict';

const express = require('express');
const moment = require('moment');
const {promisify: _p} = require('util');


const path = require('path');
const bodyParser = require('body-parser')
const APP = module.exports = express();
const _generateUuid = require('uuid/v1');
if (require.main === module) {
  const PORT = Number(process.env.APP_PORT || 3000);
  APP.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`);
  });
}
APP.use(express.json());
APP.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

APP.get('/', function (req, res) {
  res.send(`Express Server online - ${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}`);
});

function buildPath(id, noExtension) {
  const NOTES_FOLDER_NAME = 'notes';
  const PATH_ARRAY = [__dirname, NOTES_FOLDER_NAME];
  if (id) {
    PATH_ARRAY.push(`${id}${noExtension ? '' : '.txt'}`);
  }
  return PATH_ARRAY.join(path.sep);
}

async function _getNotes(req, res) {
  const fs = require('fs');

  const FILES_NAME = await _p(fs.readdir)(buildPath(null));
  if (req.params.id) {
    if (!FILES_NAME.includes(req.params.id)) {
      return res.status(404).send('No note with id specified');
    }
    const FILE = await _p(fs.readFile)(buildPath(req.params.id, true), 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({id: req.params.id, note: FILE}));
  }
  else {
    const FILES_DATA = await Promise.all(FILES_NAME.map(fileName => {
      return _p(fs.readFile)(buildPath(fileName, true), 'utf8');
    }));

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(FILES_DATA.map((data, idx) => ({id: FILES_NAME[idx], note: data}))));
  }
}

async function _delNotes(req, res) {
  const fs = require('fs');
  const FILES_NAME = await _p(fs.readdir)(buildPath(null));
  if (req.params.id) {
    if (!FILES_NAME.includes(req.params.id)) {
      return res.status(404).send('No note with id specified');
    }
    await _p(fs.unlink)(buildPath(req.params.id, true));
  }
  else {
    await Promise.all(FILES_NAME.map(fileName => {
      return _p(fs.unlink)(buildPath(fileName, true));
    }));
  }

  res.status(204).end();
}

APP.route('/notes')
   .get((req, res) => {
     _getNotes(req, res).catch((err) => {
       res.end(JSON.stringify(err));
     });
   })
   .post((req, res) => {
     const fs = require('fs');
     const ID = _generateUuid();
     if (!req.body.note) {
       return res.status(400).send('Field note is required');
     }
     fs.writeFile(buildPath(ID), req.body.note, 'utf8', (err) => {
       if (err) {
         return res.status(500).send('Something broke!');
       }
       res.statusCode = 200;
       res.setHeader('Content-Type', 'application/json');
       res.send(JSON.stringify({id: ID, note: req.body.note}));
     });
   })
   .delete((req, res) => {
     _delNotes(req, res).catch((err) => {
       res.end(JSON.stringify(err));
     });
   });

APP.route('/notes/:id')
   .get(function (req, res) {
     _getNotes(req, res).catch((err) => {
       res.end(JSON.stringify(err));
     });
   })
   .put(function (req, res) {
     //todo
     res.send('Add a book')
   })
   .delete(function (req, res) {
     _delNotes(req, res).catch((err) => {
       res.end(JSON.stringify(err));
     });


// start the server only if `$ node server.js`
