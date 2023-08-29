const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const electionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date : {
    type: String,
    required: true
  }
});

const Election = new mongoose.model('Election', electionSchema);

router.get('/', async (req, res) => {
  const elections = await Election.find().sort('date');
  res.send(elections);
});

router.get('/:id', async (req, res) => {
  const election = await Election.findById(req.params.id);
  if(!election) return res.status(400).send("The election with the given ID was not found");

  res.send(election);
});

router.post('/', async (req, res) => {
  const { error } = validateElection(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let election = new Election({
    name: req.body.name,
    date: req.body.date
  });
  election = await election.save();
  res.send(election);
});

router.put('/:id', async (req, res) => {
  const { error } = validateElection(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const election = new Election({
    name: req.body.name,
    date: req.body.date
  }, {new: true});

  if(!election) return res.status(400).send("The election with the given ID was not found");

  res.send(election);
});


function validateElection(election) {
  const schema = {
    name: Joi.string().required(),
    date: Joi.string().required()
  }

  return Joi.validate(election, schema);
};

module.exports = router;
