const fs = require('fs');
const path = require('path');
const htmlPdfNode = require('html-pdf-node');

const generatePdf = async (htmlContent, pdfPath) => {
    const options = { format: 'A4' };
    const file = { content: htmlContent };

    htmlPdfNode.generatePdf(file, options).then(pdfBuffer => {
        fs.writeFileSync(pdfPath, pdfBuffer);
        console.log('PDF file created', pdfPath);
    }).catch(err => {
        console.error('Error generating PDF:', err);
    });
};

module.exports = generatePdf;
