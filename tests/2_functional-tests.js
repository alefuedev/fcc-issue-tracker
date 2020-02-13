/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('POST /api/issues/{project} => object with issue data', function() {
    test('Every field filled in', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'test',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA',
        })
        .end(function(err, res) {
          assert.equal(res.body.issue_title, 'test');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(
            res.body.created_by,
            'Functional Test - Every field filled in',
          );
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
        });
      done();
    });

    test('Required fields filled in', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'test',
          issue_text: 'text mandatory',
          created_by: 'Functional Test - required fields filled in',
          assigned_to: '',
          status_text: '',
        })
        .end(function(err, res) {
          assert.equal(res.body.issue_title, 'test');
          assert.equal(res.body.issue_text, 'text mandatory');
          assert.equal(
            res.body.created_by,
            'Functional Test - required fields filled in',
          );
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
        });
      done();
    });

    test('Missing required fields', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: '',
          assigned_to: 'Admin',
          status_text: 'issue title, issue text and created by empty',
        })
        .end(function(err, res) {
          assert.equal(res.body.errors.issue_title.properties.type, 'required');
          assert.equal(res.body.errors.issue_text.properties.type, 'required');
          assert.equal(res.body.errors.created_by.properties.type, 'required');
        });
      done();
    });
  });

  suite('PUT /api/issues/{project} => text', function() {
    test('No body', function(done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id: '5e4208cc83602e70041b0c8d',
          issue_title: '',
          issue_text: '',
          created_by: '',
          assigned_to: '',
          status_text: '',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no updated field sent');
        });
      done();
    });

    test('One field to update', function(done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id: '5e446108bf40ec1db56da017',
          issue_title: 'test',
          issue_text: 'This is a modify text2',
          created_by: '',
          assigned_to: '',
          status_text: '',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'succesfully updated');
        });
      done();
    });

   test('Multiple fields to update', function(done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id: '5e446108bf40ec1db56da017',
          issue_title: 'test.',
          issue_text: 'This is a modify text2.',
          created_by: 'Admin.',
          assigned_to: 'this too',
          status_text: 'this too',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal( res.text, 'succesfully updated');
        });
      done();
    });

  });

  suite(
    'GET /api/issues/{project} => Array of objects with issue data',
    function() {
      test('No filter', function(done) {
        chai
          .request(server)
          .get('/api/issues/test')
          .query({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });

      test('One filter', function(done) {
        chai
          .request(server)
          .get('/api/issues/test2')
          .query({created_by: 'Admin'})
          .end(function(err, res) {
            assert.isArray(res.body);
            assert.equal(res.body[0].issue_title, 'test2');
            assert.equal(res.body[0].issue_text, 'test for chai');
            assert.equal(res.body[0].created_by, 'Admin');
            assert.equal(res.body[0].assigned_to, 'Admin');
            assert.equal(res.body[0].status_text, '');
            assert.equal(res.status, 200);
            done();
          });
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai
          .request(server)
          .get('/api/issues/test2')
          .query({created_by: 'Admin', issue_title: 'test2'})
          .end(function(err, res) {
            assert.isArray(res.body);
            assert.equal(res.body[0].issue_title, 'test2');
            assert.equal(res.body[0].issue_text, 'test for chai');
            assert.equal(res.body[0].created_by, 'Admin');
            assert.equal(res.body[0].assigned_to, 'Admin');
            assert.equal(res.body[0].status_text, '');
            assert.equal(res.status, 200);
            done();
          });
      });
    },
  );

  suite('DELETE /api/issues/{project} => text', function() {
    test('No _id', function(done) {
      chai
        .request(server)
        .delete('/api/issues/title')
        .send({_id: ''})
        .end(function(err, res) {
          assert.equal(res.text, '_id error');
        });
      done();
    });

    test('Valid _id', function(done) {
      chai
        .request(server)
        .delete('/api/issues/title')
        .send({_id: '5e4208cc83602e70041b0c8d'})
        .end(function(err, res) {});
      done();
    });
  });
});
