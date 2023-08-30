const {Candidate, validateCandidate} = require('../models/candidate');
const { Election } = require('../models/election');
const { Position } = require('../models/position');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const candidates = await Candidate.find().sort('name');
  res.send(candidates);
});

router.get('/:id', async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);

  if(!candidate) return res.status(404).send("The candidates with the given ID was not found")
  res.send(candidate);
})

router.post('/', async(req, res) => {
  
  const { error } = validateCandidate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const election = await Election.findById(req.body.electionId);
  if(!election) return res.status(400).send('Invalid election');

  const position = await Position.findById(req.body.positionId);
  if(!position) return res.status(400).send('Invalid position');

  let candidate = new Candidate({
    photo: req.body.photo,
    name: req.body.name,
    election: {
      _id: election._id,
      name: election.name,
      date: election.date
    },
    position: {
      _id: position._id,
      name: position.name
    },
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
  
  // Look up the candidate and Update candidate
  const candidate = await Candidate.findByIdAndUpdate(req.params.id, {
    photo: req.body.photo,
    name: req.body.name,
    position: req.body.position,
    political_party: req.body.political_party }, {
    new: true
  });

  // If not existing, return 404
  if(!candidate) return res.status(404).send("The candidates with the given ID was not found")

  // Return the updated candidate
  res.send(candidate);
});

router.delete('/:id', async (req, res) => {
  // Look up the candidate and Delete
  const candidate = await Candidate.findByIdAndRemove(req.params.id);
  // Not existing, return 404
  if(!candidate) return res.status(404).send("The candidates with the given ID was not found")

  // Return the same candidate
  res.send(candidate);
});


module.exports = router;
