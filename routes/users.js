const {userSchema, User, validateUser} = require('../models/user');

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

  const { error } = validateUser(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const user = new User({
    name: req.body.name,
    id: req.body.id
  });

  await user.save();
  res.send(user)
});
