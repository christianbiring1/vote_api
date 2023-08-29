const Joi = require('joi');
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');


const ElectorSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  }
});

const Elector = new mongoose.model('Elector', ElectorSchema);

router.get('/', async (req, res) => {
  const electors = await Elector.find();
  res.send(electors);
});

router.get('/:id', async(req, res) => {
  const elector = await Elector.findById(req.params.id);

  if(!elector) return res.status(400).send("The candidates with the given ID was not found")
  res.send(elector);
});

router.post('/', async(req, res) => {
  
  const { error } = validateElector(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let elector = new Elector({
    id: req.body.id
  });
  elector = await elector.save();
  res.send(elector);
});

function validateElector(elector) {
  const schema = {
    id: Joi.string().required()
  };

  return Joi.validate(elector, schema);
};


module.exports = router;
