const express = require('express');
const router = express.Router();
const Model = require('../model/fileReader/wordReader.js');

/* GET home page. */
router.get('/getMM', function(req, res, next) {
	console.log(req.query.string);
	res.send('Hello World');
});

module.exports = router;