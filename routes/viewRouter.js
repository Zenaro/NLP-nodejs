const express = require('express');
const router = express.Router();

router.get('/mm', function(req, res, next) {
	res.render('mm', {
		title: 'Seattle',
		cssSource: 'mm'
	});
});

router.get('/claws', function(req, res, next) {
	res.render('claws', {
		title: 'Seattle',
		cssSource: 'base'
	});
});

router.get('/hmm', function(req, res, next) {
	res.render('hmm', {
		title: 'Seattle',
		cssSource: 'base'
	});
});

module.exports = router;