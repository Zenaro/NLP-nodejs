const readline = require('readline');
const fs = require('fs');
var EventProxy = require('eventproxy');

// 文件流
const propStream = readline.createInterface({
	input: fs.createReadStream('./model/doc/prop-frequency.txt')
});
const wordPropStream = readline.createInterface({
	input: fs.createReadStream('./model/doc/word+prop-frequency.txt')
});
const propPropStream = readline.createInterface({
	input: fs.createReadStream('./model/doc/prop+prop-frequency.txt')
});

// 读取prop并存入propDic
var propDic = {};

// 读取word-prop并存入wordDic和wordPropDic
var wordDic = {},
	wordPropDic = {};

// 读取prop-prop并存入propPropDic
var propPropDic = {};

var pStream = propStream.on('line', (line) => {
	var reg = line.split(',');
	propDic[reg[0]] = parseInt(reg[1]);
});

var wpStream = wordPropStream.on('line', (line) => {
	var reg = line.split(',');
	wordPropDic[reg[0] + reg[1]] = parseInt(reg[2]);
	if (wordDic.hasOwnProperty(reg[0])) {
		wordDic[reg[0]][reg[1]] = parseInt(reg[2]);
	} else {
		var props_count = {};
		props_count[reg[1]] = parseInt(reg[2]);;
		wordDic[reg[0]] = props_count;
	}
});

var ppStream = propPropStream.on('line', (line) => {
	var reg = line.split(',');
	propPropDic[reg[0] + reg[1]] = parseInt(reg[2]);
});

module.exports = {
	getPropDic: function() {
		return propDic;
	},
	getPropPropDic: function() {
		return propPropDic;
	},
	getWordPropDic: function() {
		return wordPropDic;
	},
	getGraph: function(mmList) {
		var string = null;
		var resultList = [];
		for (var i = 0, length = mmList.length; i < length; i++) {
			var json = {};
			json[mmList[i]] = wordDic[mmList[i]];
			resultList[i] = json;
		}
		return resultList;
	}
}