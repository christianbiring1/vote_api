const mongoose = require('mongoose');
const express = require('express');

const elections = require('./routes/elections');
const positions = require('./routes/positions');
const candidates = require('./routes/candidates');
const electors = require('./routes/electors');
const votes = require('./routes/votes');
const users = require('./routes/users');
const auth = require('./routes/auth');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/voty')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to mongoDB...'));

app.use('/api/elections', elections);
app.use('/api/positions', positions);
app.use('/api/candidates', candidates);
app.use('/api/electors', electors);
app.use('/api/votes', votes);
app.use('/api/users', users);
app.use('/api/auth', auth);


app.get('/', (req, res) => {
  res.send('Welcome to Vote App!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
