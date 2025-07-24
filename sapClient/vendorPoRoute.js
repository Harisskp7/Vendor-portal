// vendorRFQRoute.js
const express = require('express');
const axios = require('axios');
const https = require('https');

const router = express.Router();

// ✅ SAP Configuration
const SAP_BASE_URL = 'http://AZKTLDS5CP.kcloud.com:8000';
const PROFILE_URL = '/sap/opu/odata/SAP/ZVENDOR_PORTAL577_SRV/';
const ENTITY_SET = 'ZPO_VENDORSet'; // Your po entity set
const SAP_CREDS = {
  username: 'K901577',
  password: 'Haris@0713',
};

// Create HTTPS agent to ignore certificate issues (for development)
const sapAgent = new https.Agent({ rejectUnauthorized: false });

// 📘 GET RFQ data for a vendor
router.get('/:vendorId', async (req, res) => {
  const vendorId = req.params.vendorId;
//   console.log('📥 Fetching PO for Vendor ID:', vendorId);

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
      return res.status(404).json({ success: false, message: 'No PO Data found for the vendor.' });
    }

    // Transform po data
    const poList = results.map(item => ({
      Lifnr: item.Lifnr,
      Ebeln: item.Ebeln,
      Aedat: item.Aedat,
      Bedat: item.Bedat,
      Ekorg: item.Ekorg,
      Matnr: item.Matnr,
      Ktmng: item.Ktmng,
      Netpr: item.Netpr,
      Statu: item.Statu,
      Txz01: item.Txz01,
      Bstyp: item.Bstyp,
    }));

    return res.json({ success: true, data: poList });
  } catch (error) {
    console.error('❌ SAP PO Fetch Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    return res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to fetch vendor Purchase Order data',
      error: error.message,
      sapError: error.response?.data,
    });
  }
});

module.exports = router;
