const Joi = require('joi');
const express = require('express');
const app = express();


app.use(express.json());

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

app.get('/', (req, res) => {
  res.send('Welcome to Vote App!');
});

app.get('/api/candidates', (req, res) => {
  res.send(candidates)
});

app.get('/api/candidates/:id', (req, res) => {
  const candidate = candidates.find(c => c.id === parseInt(req.params.id));
  if(!candidate) return res.status(404).send("The candidates with the given ID was not found")
  res.send(candidate);
})

app.post('/api/candidates', (req, res) => {
  
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

app.put('/api/candidates/:id', (req, res) => {
  // Look up the candidate
  // If not existing, return 404
  const candidate = candidates.find(c => c.id === parseInt(req.params.id));
  if(!candidate) return res.status(404).send("The candidates with the given ID was not found")

  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateCandidate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Update candidate
  candidate.photo = req.body.photo;
  candidate.name = req.body.name;
  candidate.position = req.body.position;
  candidate.political_party = req.body.political_party;
  // Return the updated candidate
  res.send(candidate);
});

app.delete('/api/candidates/:id', (req, res) => {
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


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
