const Joi = require('joi');
const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date : {
    type: String,
    required: true
  }
});

const Election = mongoose.model('Election', electionSchema);


function validateElection(election) {
  const schema = {
    name: Joi.string().required(),
    date: Joi.string().required()
  }

  return Joi.validate(election, schema);
};

exports.Election = Election;
exports.validateElection = validateElection;
