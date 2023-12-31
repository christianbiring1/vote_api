const jwt = require('jsonwebtoken');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const {User} = require('../models/user');

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid email or password');

  // The jwt private key is to be store in an environment variable
  // After installing the config library -> voty_jwtPrivateKey
  const token = user.generateAuthToken();
  // const token = jwt.sign({_id: user._id}, 'jwtPrivateKey');

  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().min(5).required()
  };

  return Joi.validate(req, schema);
};

module.exports = router;
