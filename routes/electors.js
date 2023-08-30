const {Elector, validateElector} = require('../models/elector');
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

  let elector = new Elector({
    name: req.body.name,
    id: req.body.id
  });
  elector = await elector.save();
  res.send(elector);
});

router.put('/:id', async (req, res) => {
  const { error } = validateElector(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const elector = await Elector.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    id: req.body.id
  },{
    new: true
  });

  if(!elector) return res.status(404).send("The elector with the given ID was not found");

  res.send(elector);
});

router.delete('/:id', async (req, res) => {
  const election = await Elector.findByIdAndRemove(req.params.id);

  if(!election) return res.status(404).send("The elector with the given ID was not found");

  res.send(election);
});


module.exports = router;
