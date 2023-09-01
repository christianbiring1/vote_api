const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { electionSchema } = require('./election');


const electorSchema = new mongoose.Schema({
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
  },
  election: {
    type: electionSchema,
    required: true
  }
});

const Elector = mongoose.model('Elector', electorSchema);

function validateElector(elector) {
  const schema = {
    name: Joi.string().required(),
    id: Joi.string().required(),
    province: Joi.string().required(),
    electionId: Joi.objectId().required()
  };

  return Joi.validate(elector, schema);
};

exports.Elector = Elector;
exports.electorSchema = electorSchema;
exports.validateElector = validateElector;
