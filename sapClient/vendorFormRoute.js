// vendorPdfRoute.js
const express = require('express');
const axios = require('axios');
const https = require('https');
const xml2js = require('xml2js');

const router = express.Router();

// ✅ SAP Configuration
const SAP_BASE_URL = 'http://AZKTLDS5CP.kcloud.com:8000';
const SERVICE_PATH = '/sap/opu/odata/SAP/ZVENDOR_PORTAL577_SRV';
const ENTITY_SET = 'ZFORM_VENDORSet'; // PDF entity set
const SAP_CREDS = {
  username: 'K901577',
  password: 'Haris@0713',
};

// Create HTTPS agent to ignore certificate issues (for development)
const sapAgent = new https.Agent({ rejectUnauthorized: false });

// 📘 GET PDF for a given Invoice Number (Belnr)
router.get('/:belnr', async (req, res) => {
  const { belnr } = req.params;
  console.log('📥 Fetching PDF for Belnr:', belnr);

  if (!belnr) {
    return res.status(400).json({ success: false, message: 'Belnr (Invoice Number) is required.' });
  }

  try {
    const url = `${SAP_BASE_URL}${SERVICE_PATH}/${ENTITY_SET}(Belnr='${belnr}')`;

    const response = await axios.get(url, {
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${SAP_CREDS.username}:${SAP_CREDS.password}`).toString('base64'),
        Accept: 'application/xml',
      },
      httpsAgent: sapAgent,
    });

    const xml = response.data;

    // Parse XML to JSON
    xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('❌ XML Parsing Error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to parse XML response from SAP.',
        });
      }

      try {
        const properties = result?.entry?.content?.['m:properties'];
        const pdfBase64 = properties?.['d:PdfString'];
        const invoiceNumber = properties?.['d:Belnr'];

        if (!pdfBase64 || !invoiceNumber) {
          throw new Error('Missing PDF or Belnr data in response.');
        }

        return res.json({
          success: true,
          belnr: invoiceNumber,
          pdfBase64,
        });
      } catch (parseError) {
        console.error('❌ Property Extraction Error:', parseError);
        return res.status(500).json({
          success: false,
          message: 'Failed to extract PDF string from parsed data.',
        });
      }
    });
  } catch (error) {
    console.error('❌ SAP PDF Fetch Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    return res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to fetch PDF invoice from SAP.',
      error: error.message,
      sapError: error.response?.data,
    });
  }
});

module.exports = router;
