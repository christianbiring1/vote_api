const Joi = require('joi');
const express = require('express');
const router = express.Router();

const candidates = [
  {
      id: 1,
      photo: 'ptoho',
      name: 'Williams Doe',
      position: 'Deputy',
      political_party: 'UNIC'
    },
    {
      id: 2,
      photo: 'photo',
      name: 'Jane Doe',
      position: 'Deputy',
      political_party: 'UNIC'
    },
    {
      id: 3,
      photo: 'photo',
      name: 'Williams Doe',
      position: 'Deputy',
      political_party: 'UNIC'
    },
];

router.get('/', (req, res) => {
  res.send(candidates)
});

router.get('/:id', (req, res) => {
  const candidate = candidates.find(c => c.id === parseInt(req.params.id));
  if(!candidate) return res.status(400).send("The candidates with the given ID was not found")
  res.send(candidate);
})

router.post('/', (req, res) => {
  
  const { error } = validateCandidate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const candidate = {
    id: candidates.length + 1,
    photo: req.body.photo,
    name: req.body.name,
    position: req.body.position,
    political_party: req.body.political_party
  };

  candidates.push(candidate);
  res.send(candidate);
});

router.put('/:id', (req, res) => {
  // Look up the candidate
  // If not existing, return 404
  const candidate = candidates.find(c => c.id === parseInt(req.params.id));
  if(!candidate) return res.status(400).send("The candidates with the given ID was not found")

  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateCandidate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Update candidate
  candidate.id = req.body.id;
  candidate.photo = req.body.photo;
  candidate.name = req.body.name;
  candidate.position = req.body.position;
  candidate.political_party = req.body.political_party;
  // Return the updated candidate
  res.send(candidate);
});

router.delete('/:id', (req, res) => {
  // Look up the candidate
  // Not existing, return 404
  const candidate = candidates.find(c => c.id === parseInt(req.params.id));
  if(!candidate) return res.status(404).send("The candidates with the given ID was not found")

  // Delete
  const index = candidates.indexOf(candidate);
  candidates.splice(index, 1);

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
