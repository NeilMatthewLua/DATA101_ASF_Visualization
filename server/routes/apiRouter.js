var express = require('express');
var router = express.Router();
const api = require('../api/api');

router.post('/hogcount', api.retrieveHogCount);

module.exports = router;