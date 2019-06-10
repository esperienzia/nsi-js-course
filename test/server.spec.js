'use strict';

const {expect} = require('chai');
const request = require('supertest');
const moment = require('moment');
const app = require('../server');
const mockery = require('mockery');

describe('File server.js', () => {
  before(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
    let mockFs = {
      writeFile: (name, content, coding, next) => {
        return next(null);
      }
    };
    mockery.registerMock('fs', mockFs);
  });


  it('route not found', async () => {
    await request(app)
      .get('/users')
      .expect(404)
      .then();
  });
  it('route found', async () => {
    const RESPONSE = await request(app)
      .get('/')
      .expect(200)
      .then();
    const REG_EX = new RegExp(`${moment().format('dddd, MMMM Do YYYY, h:mm')}`);
    expect(RESPONSE.text).to.match(REG_EX);
  });

  describe('/notes', () => {
    describe('get', () => {
      it('should retun get all books',async () => {
        const RESPONSE = await request(app)
          .get('/notes')
          .expect(200)
          .then();
        expect(Object.keys(RESPONSE.body).length).to.equal(0);
      });
    });
    describe('post', () => {
      it('should fail if no note is defined',async () => {
        const RESP = await request(app)
          .post('/notes')
          .send({name: 'pippo'})
          .expect(400);
        expect(RESP.error).to.exist;
        expect(RESP.error.text).to.equal('Field note is required');
      });
      it.only('should return on object representing the file', async() => {
        const RESP = await request(app)
          .post('/notes')
          .send({name: 'pippo', note: 'corpoDellaNota'})
          .expect(200);
        expect(RESP.error).to.equal(false);
        expect(RESP.body.id).to.exist;
        expect(RESP.body.note).to.equal('corpoDellaNota');
        expect(RESP.body.name).to.not.exist;
      });
    });
    describe('delete', () => {
      it('should return Delete all the book', async() => {
        const RESPONSE = await request(app)
          .delete('/notes')
          .expect(200)
          .then();
        expect(RESPONSE.text).to.equal('Delete all the book');
      });
    });
  });

  describe('/notes/:id', () => {
    describe('get', () => {
      it('should return Get a single book', async() => {
        const RESPONSE = await request(app)
          .get('/notes/123')
          .expect(200)
          .then();
        expect(RESPONSE.text).to.equal('Get a single book');
      });
    });
    describe('post', () => {
      it('should return Add a book', async() => {
        const RESPONSE = await request(app)
          .post('/notes/123')
          .expect(200)
          .then();
        expect(RESPONSE.text).to.equal('Add a book');
      });
    });
    describe('delete', () => {
      it('should return Update the book', async() => {
        const RESPONSE = await request(app)
          .delete('/notes/123')
          .expect(200)
          .then();
        expect(RESPONSE.text).to.equal('Update the book');
      });
    });
  });

  after(() => {
    mockery.deregisterAll();
    mockery.disable();
  });
});