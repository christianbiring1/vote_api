const _ = require('lodash');
const {Vote, validateVote} = require('../models/vote');
const { Candidate } = require('../models/candidate');
const { Elector } = require('../models/elector');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const votes = await Vote.find();
  res.send(votes);
});

router.post('/', async (req, res) => {
  const { error } = validateVote(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const candidate = await Candidate.findById(req.body.candidateId);
  if(!candidate) return res.status(400).send('Invalid candidate');

  const elector = await Elector.findById(req.body.electorId);
  if(!elector) return res.status(400).send('Invalid elector');

  // let vote = await Vote.findOne(_.pick(req.body, ['candidate', 'elector']));
  // if(vote) return res.status(403).send('You cannot vote more than once!')


  const vote = new Vote({
    candidate: {
      _id: candidate._id,
      first_name: candidate.first_name,
      last_name: candidate.last_name,
      position: candidate.position,
      political_party: candidate.political_party
    },
    elector: {
      _id: elector._id,
      name: elector.name,
      id: elector.id,
      province: elector.province
    }
  });

  candidate.voice += 1;
  candidate.save();
  await vote.save();
  res.send(vote);
});

module.exports = router;
