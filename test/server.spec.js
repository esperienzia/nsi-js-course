'use strict';

const {expect} = require('chai');
const request = require('supertest');
const moment = require('moment');
const app = require('../server');

describe('File server.js', () => {
  it('a simple test that fails', () => {
    expect(1).to.equal(2);
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
});