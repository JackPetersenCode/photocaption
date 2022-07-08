const request = require('supertest');
const assert = require('chai').assert

const app = require('../app');

describe('GET /captions', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/captions')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /photos', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/photos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /users', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

