const Joi = require('joi');
const mongoose = require('mongoose');
const {electionSchema} = require('./election');
const {positionSchema} = require('./position');

const candidateSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
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
  voice: {
    type: Number,
    default: 0
  }
});

const Candidate = mongoose.model('Candidate', candidateSchema);


function validateCandidate(candidate) {
  const schema = {
    photo: Joi.string().required(),
    name: Joi.string().min(3).required(),
    electionId: Joi.string().required(),
    positionId: Joi.string().required(),
    political_party: Joi.string().required()
  }

  return Joi.validate(candidate, schema);
}

exports.Candidate = Candidate;
exports.candidateSchema = candidateSchema;
exports.validateCandidate = validateCandidate;