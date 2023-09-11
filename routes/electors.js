const _ = require('lodash');
const multer = require('multer');
const excel = require('exceljs');
const { Election } = require('../models/election');
const {Elector, validateElector} = require('../models/elector');
const auth = require('../middleware/auth');


const express = require('express');
const { append } = require('express/lib/response');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const FILE_UPLOAD = multer({ storage: storage });

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

router.post('/upload-excel', FILE_UPLOAD.single('excelFile'), async (req, res) => {
   // Handle the uploaded file here
  //  use a library like 'exceljs' to parse Excel data
  const filePath = req.file.path;   // Path to the uploaded Excel file

  const workbook = new excel.Workbook();

  try {
    await workbook.xlsx.readFile(filePath);

    // Assuming the elector data is in the first worksheet
    const worksheet = workbook.getWorksheet(1);

    const electorData = [];
    worksheet.eachRow((row, rowNumber) => {
      // Assuming the columns are in order: name, id, province, electionId
      electorData.push({
        name: row.getCell(1).value,
        id: row.getCell(2).value,
        province: row.getCell(3).value,
        electionId: row.getCell(4).value,
      });
    });

      // Now the 'electorData' contains the elector data from the Excel file

      await Promise.all(electorData.map(async(electorInfo) => {

        const { error } = validateElector(electorInfo);
        if (error) {
          console.error('Invalid elector data:', error.details[0].message)
          return; // Skip invalid data
        }

        // Check if the elector already exists based on 'id' or any other unique identifier
        const existingElector = await Elector.findOne({ id: electorInfo.id });
        if (existingElector) {
          console.error('Elector with ID already exists:', electorInfo.id);
          return; // Skip existing electors
        }

        // Creat a new Elector document and save it to the database
        const newElector = new Elector({
            name: electorInfo.name,
            id: electorInfo.id,
            province: electorInfo.province,
            electionId: electorInfo.electionId, // Assuming the election ID is valid
          });

        await newElector.save();
      }));

    res.status(200).send('Elector data imported successfully')

  } catch (error) {
    console.error('Error parsing Excel file:', error);
    res.status(500).send('Error parsing Excel file');
  }
})

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
