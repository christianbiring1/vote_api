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

    // Defining the table headers
    const tableHeaders = ['First Name', 'Last Name', 'Political Party', 'Voices'];

    // Calculate column widths based on page width
    const columnWidths = [100, 100, 100, 100, 100];
    const tableX = 50;
    const startY = 50;

    // Set font size for table content
    doc.font('Helvetica-Bold').text(tableHeaders.join('\t'), tableX, startY);

    // Add candidate information to the PDF table
    let tableY = startY + 20;
    for (const candidate of candidates) {
      doc.text(candidate.first_name, tableX + columnWidths[0], tableY);
      doc.text(candidate.last_name, tableX + columnWidths[0] + columnWidths[1], tableY);
      doc.text(candidate.political_party, tableX + columnWidths[0] + columnWidths[1] + columnWidths[2], tableY);
      doc.text(candidate.position.name, tableX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], tableY);
      doc.text(candidate.voice.toString(), tableX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], tableY);

    }
    // doc.fontSize(16).text('Candidate Report (Descending Order by Votes)', { align: 'center' });

    // Add candidate information to the PDF
    // candidates.forEach((candidate, index) => {
    //   doc.fontSize(12).text(`#${index + 1}: ${candidate.first_name} ${candidate.last_name}`);
    //   doc.fontSize(10).text(`Position: ${candidate.position}`);
    //   doc.fontSize(10).text(`Political Party: ${candidate.political_party}`);
    //   doc.fontSize(10).text(`Total Votes: ${candidate.voice}`);
    //   doc.moveDown(1);
    // });

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
