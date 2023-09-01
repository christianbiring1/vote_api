const Joi = require('joi');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().required(),
    id: Joi.string().required()
  };

  return Joi.validate(user);
};

exports.userSchema = userSchema;
exports.User = User;
exports.validateUser = validateUser;
