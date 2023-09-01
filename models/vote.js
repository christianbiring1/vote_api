const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const {positionSchema} = require('./position');

const voteSchema = new mongoose.Schema({
  candidate: {
    type: new mongoose.Schema({
      name: {
        type: String,
        lowercase: true,
        required: true
      },
      position: {
        type: positionSchema,
        required: true
      },
      political_party: {
        type: String,
        lowercase: true,
        required: true
      }
    }),
    required: true
  },
  elector: {
    type: new mongoose.Schema({
      name: {
        type: String,
        lowercase: true,
        trim: true
      },
      id: {
        type: String,
        required: true,
        trim: true
      },
      province: {
        type: String,
        required: true,
        trim: true
      }
    }),
    required: true
  }
});

const Vote = mongoose.model('Vote', voteSchema);

function validateVote(vote) {
  const schema = {
    electorId: Joi.objectId().required(),
    candidateId: Joi.objectId().required()
  };

  return Joi.validate(vote, schema);
};

exports.Vote = Vote;
exports.validateVote = validateVote;
