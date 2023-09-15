const express = require('express');
const app = express();
const abrigos = require('../src/router/abrigosRoutes');
app.use(express.json());
app.use('/abrigos', abrigos);
module.exports = app;