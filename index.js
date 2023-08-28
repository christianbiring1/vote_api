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
  console.log(candidate)
  if(!candidate) res.status(404).send("This candidates with the given ID was not found")
  res.send(candidate);
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
