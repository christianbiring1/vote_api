const Joi = require('joi');
const mongoose = require('mongoose');


const ElectorSchema = new mongoose.Schema({
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
});

const Elector = mongoose.model('Elector', ElectorSchema);



function validateElector(elector) {
  const schema = {
    name: Joi.string().required(),
    id: Joi.string().required()
  };

  return Joi.validate(elector, schema);
};

exports.Elector = Elector;
exports.validateElector = validateElector;
