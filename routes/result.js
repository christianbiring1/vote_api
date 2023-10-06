const pdf = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Candidate } = require('../models/candidate');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Fetch candidates sorted by votes in descending order
    const candidates = await Candidate.find().sort({ voice: -1 });

    // Create a new PDF document
    const doc = new pdf();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=candidate_report.pdf');

    // Pipe the PDF to the response
    doc.pipe(res);

    doc.fontSize(16).text('Candidate Report (Descending Order by Votes)', { align: 'center' });

    // Add candidate information to the PDF
    candidates.forEach((candidate, index) => {
      doc.fontSize(12).text(`#${index + 1}: ${candidate.first_name} ${candidate.last_name}`);
      doc.fontSize(10).text(`Position: ${candidate.position}`);
      doc.fontSize(10).text(`Political Party: ${candidate.political_party}`);
      doc.fontSize(10).text(`Total Votes: ${candidate.voice}`);
      doc.moveDown(1);
    });

    // End the PDF document
    doc.end();

    // You can also save the PDF to a file if needed
    const pdfPath = path.join(__dirname, 'candidate_report.pdf');
    doc.pipe(fs.createWriteStream(pdfPath));

    // Send the PDF as a response
    res.sendFile(pdfPath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating PDF report');
  }
});

module.exports = router;
