const express = require('express');
const app = express();

const candidates = require('./routes/candidates');
app.use('/api/candidates', candidates);

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Welcome to Vote App!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
