'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
const Project = require('../models/project');

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = function(app) {
  app
    .route('/api/issues/:project')

    .get(function(req, res) {
      let projectName = req.params.project;
      let projectQuery = {issue_title: projectName};
      let querys = req.query;
      let query = {...projectQuery, ...querys};
      Project.find(query).exec(function(err, data) {
        if (err) {
          res.redirect('/');
        } else {
          res.send(data);
        }
      });
    })

    .post(function(req, res) {
      let {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;
      let p = new Project({
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        updated_on: Date.now(),
      });

      p.save(function(err, doc) {
        if (err) {
          res.send(err);
        } else {
          return res.send(doc);
        }
      });
    })

    .put(async function(req, res) {
      let {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;
      if (
        issue_title == '' &&
        issue_text == '' &&
        created_by == '' &&
        assigned_to == '' &&
        status_text == '' &&
        open == undefined
      ) {
        res.send('no updated field sent.');
      } else {
        let p = await Project.findOne({_id}, function(err, project) {
          if (err) {
            res.send('could not update ' + _id);
          } else {
            return project;
          }
        });

        if (issue_title == undefined) {
          p.open = open;
          p.save(function(err, project) {
            if (err) {
              console.log(err);
            } else {
              res.send('succesfully updated');
            }
          });
        } else {
          issue_title != '' ? (p.issue_title = issue_title) : issue_title;
          issue_text != '' ? (p.issue_text = issue_text) : issue_text;
          created_by != '' ? (p.created_by = created_by) : created_by;
          assigned_to != '' ? (p.assigned_to = assigned_to) : assigned_to;
          status_text != '' ? (p.status_text = status_text) : status_text;
          p.open = open;
          p.updated_on = Date.now();

          p.save(function(err, project) {
            if (err) {
              res.send('could not update');
            } else {
              res.send('succesfully updated');
            }
          });
        }
      }
    })

    .delete(function(req, res) {
      var projectId = req.body._id;
      if (projectId == '') {
        res.send('_id error');
      } else {
        Project.findOneAndDelete({_id: projectId}, function(err) {
          if (err) {
            res.send('could not delete ' + projectId);
          } else {
            res.send('deleted ' + projectId);
          }
        });
      }
    });
};
