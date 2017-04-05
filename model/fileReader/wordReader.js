const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
	input: fs.createReadStream('./model/doc/chineseDic.txt')
});
var json = {};

var online = rl.on('line', (line) => {
	var reg = line.split(',');
	json[reg[0]] = reg[1];
});

module.exports = json;