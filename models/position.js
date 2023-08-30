const Joi = require('joi');
const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true
  }
});

const Position = mongoose.model('Position', PositionSchema);

function validatePosition(position) {
  const schema = {
    name: Joi.string().required()
  };

  return Joi.validate(position, schema);
};

exports.Position = Position;
exports.validatePosition = validatePosition;
