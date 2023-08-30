 
const Joi = require('joi');
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  position: {
    type: String,
    required: true
  },
  political_party :{
    type: String,
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
    position: Joi.string().required(),
    political_party: Joi.string().required()
  }

  return Joi.validate(candidate, schema);
}

exports.Candidate = Candidate;
exports.validateCandidate = validateCandidate;