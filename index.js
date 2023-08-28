const Joi = require('joi');
const express = require('express');
const app = express();


app.use(express.json());

const candidates = [
  {
      id: 1,
      photo: '',
      name: 'Williams Doe',
      position: 'Deputy',
      political_party: 'UNIC'
    },
    {
      id: 2,
      photo: '',
      name: 'Jane Doe',
      position: 'Deputy',
      political_party: 'UNIC'
    },
    {
      id: 3,
      photo: '',
      name: 'Williams Doe',
      position: 'Deputy',
      political_party: 'UNIC'
    },
];

app.get('/', (req, res) => {
  res.send('Welcome to Vote App!');
});

app.get('/api/elections', (req, res) => {
  res.send('votes')

});

app.get('/api/elections/:id', (req, res) => {
  res.send(req.params.id)
  
});

app.get('/api/candidates', (req, res) => {
  res.send(candidates)
});

app.get('/api/candidates/:id', (req, res) => {
  const candidate = candidates.find(c => c.id === parseInt(req.params.id));
  if(!candidate) return res.status(404).send("This candidates with the given ID was not found")
  res.send(candidate);
})

app.post('/api/candidates', (req, res) => {

  const schema = {
    photo: Joi.string().required(),
    name: Joi.string().min(3).required(),
    position: Joi.string().required(),
    political_party: Joi.string().required()
  }

  const result = Joi.validate(req.body, schema);

  if(result.error) return res.status(400).send(result.error.details[0].message);
  
  const candidate = {
    id: candidates.length + 1,
    photo: req.body.photo,
    name: req.body.name,
    position: req.body.position,
    political_party: req.body.political_party
  };
  candidates.push(candidate);
  res.send(candidate);
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
