let mongoose = require('mongoose');

// assign_to and status_text are optional

let projectSchema = new mongoose.Schema({
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: String,
  status_text: String,
  created_on: {
    type: Date,
    default: Date.now,
  },
  updated_on: Date,
  open: {type: Boolean, default: true},
});

let Project = mongoose.model('Project', projectSchema);

module.exports = Project;
