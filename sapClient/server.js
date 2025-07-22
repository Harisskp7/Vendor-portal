// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const xml2js = require('xml2js');
const https = require('https');

// Import route files
const vendorLoginRoute = require('./vendorLoginRoute');
const vendorProfileRoute = require('./vendorProfileRoute');
const vendorRFQRoute = require('./vendorRfqRoute');
const vendorPoRoute = require('./vendorPoRoute');
const vendorGrRoute = require('./vendorGrRoute');
const vendorInvoiceRoute = require('./vendorInvoiceRoute');
const vendorMemoRoute = require('./vendorMemoRoute');
const vendorPayRoute = require('./vendorPayRoute');
const vendorFormRoute = require('./vendorFormRoute');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Route mounting
app.use('/api/vendor/login', vendorLoginRoute);  // if you move login to route file
app.use('/api/vendor/profile', vendorProfileRoute);
app.use('/api/vendor/rfq', vendorRFQRoute);
app.use('/api/vendor/po', vendorPoRoute);
app.use('/api/vendor/gr', vendorGrRoute);
app.use('/api/vendor/inv', vendorInvoiceRoute);
app.use('/api/vendor/memo', vendorMemoRoute);
app.use('/api/vendor/pay', vendorPayRoute);
app.use('/api/vendor/form', vendorFormRoute);


// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
