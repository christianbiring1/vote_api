const _ = require('lodash');
const multer = require('multer');
const {Candidate, validateCandidate} = require('../models/candidate');
const { Election } = require('../models/election');
const { Position } = require('../models/position');
const auth = require('../middleware/auth');


const express = require('express');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  const candidates = await Candidate.find().sort('name');
  res.send(candidates);
});

router.get('/:id', async (req, res) => {
  const candidate = await Candidate.findById(req.params.id);

  if(!candidate) return res.status(404).send("The candidates with the given ID was not found")
  res.send(candidate);
})

router.post('/', upload.single('photo'), async(req, res) => {
  
  console.log(req.file);
  const { error } = validateCandidate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const election = await Election.findById(req.body.electionId);
  if(!election) return res.status(400).send('Invalid election');

  const position = await Position.findById(req.body.positionId);
  if(!position) return res.status(400).send('Invalid position');


  // let candidate = Candidate.findOne(_.pick(req.body,['first_name', 'last_name']));
  // if(candidate) return res.status(400).send('Candidate with the same credential already existed.');

  const candidate = new Candidate({
    photo: req.file.filename,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
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
  await candidate.save();
  res.send(candidate);
});

router.put('/:id', async(req, res) => {
  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateCandidate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  // Look up the candidate and Update candidate
  const candidate = await Candidate.findByIdAndUpdate(req.params.id, {
    photo: req.file.filename,
    name: req.body.name,
    positionId: req.body.positionId,
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
