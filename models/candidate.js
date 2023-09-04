const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const {electionSchema} = require('./election');
const {positionSchema} = require('./position');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  election: {
    type: electionSchema,
    required: true
  },
  position: {
    type: positionSchema,
    required: true
  },
  political_party :{
    type: String,
    lowercase: true,
    trim: true,
    required: true
  },
  photo: {
    type: String,
    required: true,
  },
  voice: {
    type: Number,
    default: 0
  }
});

const Candidate = mongoose.model('Candidate', candidateSchema);


function validateCandidate(candidate) {
  const schema = {
    name: Joi.string().min(3).max(20).required(),
    electionId: Joi.objectId().required(),
    positionId: Joi.objectId().required(),
    political_party: Joi.string().required(),
    photo: Joi.string().required(),
  }

  return Joi.validate(candidate, schema);
}

exports.Candidate = Candidate;
exports.candidateSchema = candidateSchema;
exports.validateCandidate = validateCandidate;