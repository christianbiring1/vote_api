const _ = require('lodash');
const {Position, validatePosition} = require('../models/position');
const auth = require('../middleware/auth');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const positions = await Position.find().sort('name');
  res.send(positions);
});

router.post('/', async (req, res) => {
  const { error } = validatePosition(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const position = new Position(_.pick(req.body, ['name']));

  await position.save();
  res.send(position);
});

router.delete('/:id', async (req, res) => {
  const position = await Position.findByIdAndRemove(req.params.id);

  if(!position) return res.status(404).send("The position with the given id was not found");

  res.send(position);
});


module.exports = router;
