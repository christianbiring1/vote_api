const Joi = require('joi');
const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true
  }
});

const Position = mongoose.model('Position', positionSchema);

function validatePosition(position) {
  const schema = {
    name: Joi.string().required()
  };

  return Joi.validate(position, schema);
};

exports.Position = Position;
exports.positionSchema = positionSchema;
exports.validatePosition = validatePosition;
