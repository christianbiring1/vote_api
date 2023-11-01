const _ = require('lodash');
const multer = require('multer');
const excel = require('exceljs');
const { Election } = require('../models/election');
const {Elector, validateElector} = require('../models/elector');
const auth = require('../middleware/auth');
const { upload } = require('../utils/storage');


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

router.post('/upload-excel', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const workbook = new excel.Workbook();

  try {
    await workbook.xlsx.readFile(filePath);

    // Assumin the elector data is in the first worksheet
    const worksheet = workbook.getWorksheet(1);
    const electorData = [];

    worksheet.eachRow((row, rowNumber) => {
      // Assuming the columns are in order: name, id, province, electorId
      electorData.push({
        name: row.getCell(1).value,
        id: row.getCell(2).value,
        province: row.getCell(3).value,
        electionId: row.getCell(4).value,
      });
    })

    // Use Promise.all to process all electors asynchronously
    await Promise.all(electorData.map(async (electorInfo) => {
      const { error } = validateElector(electorInfo);

      if(error) {
        console.error('Invalid elector data:', error.details[0].message);
        return;// Skip invalid data
      }

      const election = await Election.findById(electorInfo.electionId);
      if (!election) {
        console.error('Ivalid election')
        return; // Skip invalid election
      }

      const existingElector = await Elector.findOne({ id: electorInfo.id });
      if (existingElector) {
        console.error('Elector with ID already exists:', electorInfo.id);
        return; // Skip existing electors
      }


      // Create a new Elector document and save it to the database
      const newElector = new Elector({
        name: electorInfo.name,
        id: electorInfo.id,
        province: electorInfo.province,
        election: {
          _id: election._id,
          name: election.name,
          date: election.date
        }, // Assuming the electionId is valid
      });

      await newElector.save();
    }));

    res.status(200).send('Elector data imported successfully');
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    res.status(500).send('Error parsing Excel file');
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validateElector(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const election = await Election.findById(req.body.electionId);
  if(!election) return res.status(400).send('Invalid election');
  console.log(req.params.id);

  const elector = await Elector.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    id: req.body.id,
    province: req.body.province,
    election: {
      _id: election._id,
      name: election.name,
      date: election.date
    }
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
