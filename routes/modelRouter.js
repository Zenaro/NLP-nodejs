const express = require('express');
const router = express.Router();
const MM = require('../model/algorithm/maximumMatching');

/* GET home page. */
router.get('/getMM', function(req, res, next) {
	// console.log(req.query.string);
	// 输出JSON格式、
	var result = MM.forwardMaximumMatching(req.query.string, req.query.length);
	var response = {
		'status': 1,
		'result': result.join('/ ')
	};
	res.end(JSON.stringify(response));
});

module.exports = router;