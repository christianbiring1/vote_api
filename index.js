const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/voty')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Coould not connect to mongoDB...'))

  const elections = require('./routes/elections');
const candidates = require('./routes/candidates');

app.use('/api/elections', elections);
app.use('/api/candidates', candidates);



app.get('/', (req, res) => {
  res.send('Welcome to Vote App!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
