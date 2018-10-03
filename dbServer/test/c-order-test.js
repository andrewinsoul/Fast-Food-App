/* eslint-disable max-len */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);
const { expect } = chai;
let adminToken = '';

describe('Fast-Food-Fast backend tests  with postgres database for orders model', () => {
  describe('tests controller that gets all orders', () => {
    it('should login and get token for testing purposes', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'andrewinsoliii@gmail.com',
          password: 'password'
        })
        .end((err, res) => {
          adminToken = res.body.token;
          done();
        });
    });

    it('should return status code 200 and status success when admin user tries to get all orders', (done) => {
      chai.request(app)
        .get('/api/v1/orders')
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.eql('success');
          done();
        });
    });

    it('should return status code 403 and status error when user enters a wrong token', (done) => {
      chai.request(app)
        .get('/api/v1/orders')
        .set('x-access-token', 'WrongToken')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.eql('error');
          expect(res.body.error).to.eql('Failed to authenticate token');
          done();
        });
    });

    it('should return status code 200 when admin tries to update the status of an order with valid payload', (done) => {
      chai.request(app)
        .put('/api/v1/orders/2')
        .set('x-access-token', adminToken)
        .send({
          status: 'cancelled'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.eql('success');
          expect(res.body.message).to.eql('updated successfully');
          done();
        });
    });

    it('should return status code 400 when admin tries to update the status of an order without status field', (done) => {
      chai.request(app)
        .put('/api/v1/orders/2')
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.eql('error');
          expect(res.body.error).to.eql('status field not found, status field is required');
          done();
        });
    });

    it('should return code 400 when admin enters an unallowed value for status', (done) => {
      const status = 'Wrong value for status';
      chai.request(app)
        .put('/api/v1/orders/2')
        .set('x-access-token', adminToken)
        .send({
          status
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.eql('error');
          expect(res.body.error).to.eql(`the string ${status} is not allowed for this field, only New, Processing, Cancelled, Complete`);
          done();
        });
    });

    it('should return code 400 when admin enters a value for wrong data type of status', (done) => {
      const status = ['array for status'];
      chai.request(app)
        .put('/api/v1/orders/2')
        .set('x-access-token', adminToken)
        .send({
          status
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.eql('error');
          expect(res.body.error).to.eql('invalid data type for status, must be a string');
          done();
        });
    });
  });
});
