const _ = require('lodash');
const {Election, validateElection} = require('../models/election');
const auth = require('../middleware/auth');


const express = require('express');
const router = express.Router();


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
  
  let election = await Election.findOne(_.pick(req.body, ['name', 'date']));
  if (election) return res.status(400).send('The election with the given name and date has already been created.')


  election = new Election({
    name: req.body.name,
    date: req.body.date
  });
  await election.save();
  res.send(election);
});

router.put('/:id', async (req, res) => {
  const { error } = validateElection(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const election = await Election.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    date: req.body.date
  }, {new: true});

  if(!election) return res.status(404).send("The election with the given ID was not found");

  res.send(election);
});

router.delete('/:id', async (req, res) => {
  const election = await Election.findByIdAndRemove(req.params.id);

  if(!election) return res.status(404).send("The election with the given ID was not found");

  res.send(election);
});

module.exports = router;
