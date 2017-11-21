const mongoose = require('mongoose');
let schema = new mongoose.Schema({name: 'string'});
let Project = mongoose.model('Project', schema);

module.exports = Project;
