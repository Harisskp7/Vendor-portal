// vendorRFQRoute.js
const express = require('express');
const axios = require('axios');
const https = require('https');

const router = express.Router();

// ✅ SAP Configuration
const SAP_BASE_URL = 'http://AZKTLDS5CP.kcloud.com:8000';
const PROFILE_URL = '/sap/opu/odata/SAP/ZVENDOR_PORTAL577_SRV/';
const ENTITY_SET = 'ZMEMO_VENDORSet'; // Your po entity set
const SAP_CREDS = {
  username: 'K901577',
  password: 'Haris@071316',
};

// Create HTTPS agent to ignore certificate issues (for development)
const sapAgent = new https.Agent({ rejectUnauthorized: false });

// 📘 GET Invoice data for a vendor
router.get('/:vendorId', async (req, res) => {
  const vendorId = req.params.vendorId;
  console.log('📥 Fetching memo for Vendor ID:', vendorId);

  if (!vendorId) {
    return res.status(400).json({ success: false, message: 'Vendor ID is required.' });
  }

  try {
    // Add filter to get only RFQ (BSTYP = 'A')
    const url = `${SAP_BASE_URL}${PROFILE_URL}${ENTITY_SET}?$filter=Lifnr eq '${vendorId}'&$format=json`;

    const response = await axios.get(url, {
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${SAP_CREDS.username}:${SAP_CREDS.password}`).toString('base64'),
        Accept: 'application/json',
      },
      httpsAgent: sapAgent,
    });

    const results = response.data?.d?.results;

    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, message: 'No GR Data found for the vendor.' });
    }

    // Transform po data
    const MEMOList = results.map(item => ({
      Lifnr: item.Lifnr,
      Vbeln: item.Vbeln,
      Gjahr: item.Gjahr,
      Budat: item.Budat,
      Cpudt: item.Cpudt,
      Blart: item.Blart,
      Netwr: item.Netwr,
      Waerk: item.Waerk,
    }));

    return res.json({ success: true, data: MEMOList });
  } catch (error) {
    console.error('❌ SAP GR Fetch Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    return res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to fetch vendor Goods Reciept data',
      error: error.message,
      sapError: error.response?.data,
    });
  }
});

module.exports = router;



