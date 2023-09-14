const _ = require('lodash');
const multer = require('multer');
const excel = require('exceljs');
const { Election } = require('../models/election');
const {Elector, validateElector} = require('../models/elector');
const auth = require('../middleware/auth');


const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const electors = await Elector.find();
  res.send(electors);
});

router.get('/:id', async (req, res) => {
  const elector = await Elector.findById(req.params.id);

  if(!elector) return res.status(404).send("The elector with the given ID was not found")
  res.send(elector);
});

router.post('/', async(req, res) => {
  
  const { error } = validateElector(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const election = await Election.findById(req.body.electionId);
  if(!election) return res.status(400).send('Invalid election');

  let elector = await Elector.findOne(_.pick(req.body, ['id']));
  if(elector) return res.status(400).send('Elector with the given ID already existed');


  elector = new Elector({
    name: req.body.name,
    id: req.body.id,
    province: req.body.province,
    election: {
      _id: election._id,
      name: election.name,
      date: election.date
    }
  });
  await elector.save();
  res.send(elector);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
})

router.post('/upload-excel', async (req, res) => {
});

router.put('/:id', async (req, res) => {
  const { error } = validateElector(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const elector = await Elector.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    id: req.body.id,
    province: req.body.province,
    electionId: req.body.electionId,
  },{
    new: true
  });

  if(!elector) return res.status(404).send("The elector with the given ID was not found");

  res.send(elector);
});

router.delete('/:id', async (req, res) => {
  const elector = await Elector.findByIdAndRemove(req.params.id);

  if(!elector) return res.status(404).send("The elector with the given ID was not found");

  res.send(elector);
});


module.exports = router;
