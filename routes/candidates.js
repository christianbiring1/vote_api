const Joi = require('joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const candidateSchema = mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  position: {
    type: String,
    required: true
  },
  political_party :{
    type: String,
    require: true
  }
});

const Candidate = new mongoose.model('Candidate', candidateSchema);

router.get('/', async(req, res) => {
  const candidates = await Candidate.find().sort('name');
  res.send(candidates);
});

router.get('/:id', async(req, res) => {
  const candidate = await Candidate.findById(req.params.id);

  if(!candidate) return res.status(400).send("The candidates with the given ID was not found")
  res.send(candidate);
})

router.post('/', async(req, res) => {
  
  const { error } = validateCandidate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let candidate = new Candidate({
    photo: req.body.photo,
    name: req.body.name,
    position: req.body.position,
    political_party: req.body.political_party
  });
  candidate = await candidate.save();
  res.send(candidate);
});

router.put('/:id', async(req, res) => {
  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateCandidate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  const candidate = await Candidate.findByIdAndUpdate(req.params.id, {
    photo: req.body.photo,
    name: req.body.name,
    position: req.body.position,
    political_party: req.body.political_party
  }, {new: true});

  // Look up the candidate
  // If not existing, return 404
  // Update candidate
  if(!candidate) return res.status(400).send("The candidates with the given ID was not found")

  // Return the updated candidate
  res.send(candidate);
});

router.delete('/:id', async (req, res) => {
  // Look up the candidate
  // Delete
  const candidate = await Candidate.findByIdAndRemove(req.params.id);
  // Not existing, return 404
  if(!candidate) return res.status(404).send("The candidates with the given ID was not found")

  // Return the same candidate
  res.send(candidate);
});



function validateCandidate(candidate) {
  const schema = {
    photo: Joi.string().required(),
    name: Joi.string().min(3).required(),
    position: Joi.string().required(),
    political_party: Joi.string().required()
  }

  return Joi.validate(candidate, schema);
}

module.exports = router;
