var fileReader = require('../fileReader/clawsReader');
var CLAWS = {
	allPath: [],
	graph: [],
	mmList: [],
	countPath: function(index) {
		if (index >= this.graph.length) {
			return;
		}
		var tmpGraph = this.graph[index][this.mmList[index]];
		if (this.allPath.length == 0) {
			for (var key in tmpGraph) {
				var tmp = [];
				tmp.push(key);
				this.allPath.push(tmp);
			}
		} else {
			for (var i = 0, length = this.allPath.length; i < length; i++) {
				var originPath = this.allPath[i].slice(0);
				for (var key in tmpGraph) {
					if (this.allPath[i].length <= index) {
						this.allPath[i].push(key);
					} else {
						var tmp = originPath.slice(0);
						tmp.push(key);
						this.allPath.push(tmp);
					}
				}
			}
		}
		this.countPath(index + 1);
	},
	getOptimalPath: function(mmList) {
		this.mmList = mmList;
		this.graph = fileReader.getGraph(mmList);
		var wordPropDic = fileReader.getWordPropDic();
		var propPropDic = fileReader.getPropPropDic();
		var propDic = fileReader.getPropDic();
		this.countPath(0);
		console.log(this.allPath);

		// --
		var optimalIndex = 0;
		var optimalProbability = 0;
		for (var i = 0, length = this.allPath.length; i < length; i++) {
			var probability = 1;
			for (var j = 0, leng = this.allPath[i].length; j < leng; j++) {
				var currentProp = this.allPath[i][j]; // 当前词性
				var CountProp = propDic[currentProp]; // n出现的总次数
				var CountWordProp = wordPropDic[mmList[j] + currentProp]; // 我|n
				probability *= CountWordProp / CountProp;
				if (j === 0) { // 句子开头<BOS>
					probability *= propPropDic["<BOS>" + currentProp];
					probability /= propDic["<BOS>"];

				} else if (j === leng - 1) { // 句子结尾<EOS>
					var prevProp = this.allPath[i][j - 1]; // 上一个词性
					probability *= propPropDic[prevProp + currentProp];
					probability /= propDic[prevProp];
					probability *= propPropDic[currentProp + "<EOS>"];
					probability /= propDic[currentProp];

				} else { // 句子中间
					var prevProp = this.allPath[i][j - 1]; // 上一个词性
					probability *= propPropDic[prevProp + currentProp];
					probability /= propDic[prevProp];
				}
			}
			console.log(this.allPath[i] + "-----" + probability);
			if (probability > optimalProbability) {
				optimalProbability = probability;
				optimalIndex = i;
			}
		}
		optimalPath = this.allPath[optimalIndex];
		console.log("最优路径" + optimalPath + "----" + optimalProbability);
		return optimalPath;
	}
};
module.exports = CLAWS;