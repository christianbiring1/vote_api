const Joi = require('joi');
const _ = require('lodash');
const {Elector} = require('../models/elector');

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const voter = await Elector.findOne(_.pick(req.body, ['name', 'id']));
  if(!voter) return res.status(400).send('Invalid name or ID');


  res.send(voter);
});


function validate(req) {
  const schema = {
    name: Joi.string().required(),
    id: Joi.string().required()
  };

  return Joi.validate(req, schema);
};

module.exports = router;
