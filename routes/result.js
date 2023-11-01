const path = require('path');
const _ = require('lodash');
const pdf = require('pdfkit');
const fs = require('fs');
const { Candidate } = require('../models/candidate');
const { Elector } = require('../models/elector');
const { Election } = require('../models/election');

const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    // Fetch candidates sorted by votes in descending order based on Elections
    const electionId = req.params.id;
    const candidates = await Candidate.find({ 'election._id': electionId}).sort({ voice: -1 });
    const electors = await Elector.find({'election._id': electionId });
    const election = await Election.findById(electionId);

    // Create a new PDF document
    const doc = new pdf();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=candidate_report.pdf');

    // Pipe the PDF to the response
    doc.pipe(res);

    //Title
    const title = `${_.capitalize(election.name)} Election results`;

    // Add title centered above the table
   doc.font('Helvetica').fontSize(18).text(title, { align: 'center' });
   doc.moveDown(10);


    // Calculate column widths based on page width
    const columnWidths = [100, 100, 100, 100, 100, 100];
    const tableX = 50;
    const startY = 150;
    let tableY =  startY + 20;

    // Defining the table headers
    const tableHeaders = ['First Name', 'Last Name', 'Political Party', 'Position', 'Voices', '%'];

    // Calculate staring positions for each column
    const columnPosition = [tableX];
    for(let i = 0; i < columnWidths.length - 1; i += 1) {
      columnPosition.push(columnPosition[i] + columnWidths[i]);
    }

    // Add table headers
    for(let i = 0; i < tableHeaders.length; i += 1) {
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text(tableHeaders[i], columnPosition[i], startY);
    }

    // Add candidate information to the PDF table

    for (const candidate of candidates) {
      doc.font('Helvetica').fontSize(12).text(_.capitalize(candidate.first_name), tableX, tableY);
      doc.font('Helvetica').fontSize(12).text(_.capitalize(candidate.last_name), tableX + columnWidths[0], tableY);
      doc.font('Helvetica').fontSize(12).text(_.toUpper(candidate.political_party), tableX + columnWidths[0] + columnWidths[1], tableY);
      doc.font('Helvetica').fontSize(12).text(_.capitalize(candidate.position.name), tableX + columnWidths[0] + columnWidths[1] + columnWidths[2], tableY);
      doc.font('Helvetica').fontSize(12).text(candidate.voice.toString(), tableX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], tableY);
      doc.font('Helvetica').fontSize(12).text(((candidate.voice / electors.length) * 100).toString(), tableX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], tableY);

      tableY += 20;
    }

    // End the PDF document
    doc.end();

    // You can also save the PDF to a file if needed
    const pdfPath = path.join(__dirname, `${Date.now() + 'candidate_report.pdf'}`);
    doc.pipe(fs.createWriteStream(pdfPath));

    // Send the PDF as a response
    res.sendFile(pdfPath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating PDF report');
  }
});

module.exports = router;
