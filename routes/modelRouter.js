const express = require('express');
const router = express.Router();
const MM = require('../model/algorithm/maximumMatching');
const CLAWS = require('../model/algorithm/claws');
const HMM = require('../model/algorithm/hmm');

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

router.get('/getCLAWS', function(req, res, next) {
	var mmList = MM.forwardMaximumMatching(req.query.string, req.query.length);
	// var result = CLAWS.
	var path = CLAWS.getOptimalPath(mmList);
	var string = "";
	for (var i = 0, length = mmList.length; i < length; i++) {
		string += mmList[i] + "/" + path[i] + " ";
	}
	var response = {
		'status': 1,
		'result': string
	}
	res.end(JSON.stringify(response));
});

router.get('/getHMM', function(req, res, next) {
	var mmList = MM.forwardMaximumMatching(req.query.string, req.query.length);
	var propsList = HMM.getOptimalPath(mmList);
	var string = "";
	for (var i = 0, length = mmList.length; i < length; i++) {
		string += mmList[i] + "/" + (propsList[i] || "") + "  ";
	}
	var response = {
		'status': 1,
		'result': string
	}
	res.end(JSON.stringify(response));
});

module.exports = router;