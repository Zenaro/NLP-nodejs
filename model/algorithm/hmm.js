// 隐马尔可夫模型
var fileReader = require('../fileReader/wordPropReader');
var HMM = {
	graph: {},
	propsList: [],
	getOptimalPath: function(mmList) {
		this.propsList = [];
		this.graph = fileReader.getGraph(mmList);
		var wordPropDic = fileReader.getWordPropDic();
		var propPropDic = fileReader.getPropPropDic();
		var propDic = fileReader.getPropDic();

		var prevVector = {}, // prop-prop - double
			currentVector = {}; // prop - double
		for (var i = 0, length = this.graph.length; i < length; i++) {
			var word = mmList[i];
			var props = this.graph[i][word];
			for (var key in props) {
				var a = 0,
					b = 0;

				if (this.isEmptyObject(prevVector)) {
					var countXY = propPropDic["<BOS>" + key] == undefined ?
						1 : propPropDic["<BOS>" + key];
					var countX = propDic["<BOS>"];
					a = countXY / countX;

					var numXY = wordPropDic[word + key];
					var numX = propDic[key];
					b = numXY / numX;
					currentVector[key] = a * b;

				} else { // 计算当前词性的最优指针
					// var prevProp = props;
					var prevProp = [];
					for (var k in prevVector) {
						prevProp.push(k);
					}
					var optimalPropVec = 0,
						currentPropVec = 0;
					for (var k in prevProp) {
						var prevP = prevProp[k];
						var countXY = propPropDic[prevP + key] == undefined ?
							1 : propPropDic[prevP + key];
						var countX = propDic[prevP];
						a = countXY / countX;

						var numXY = wordPropDic[word + key];
						var numX = propDic[key];
						b = numXY / numX;

						currentPropVec = prevVector[prevP] * a * b;
						if (currentPropVec > optimalPropVec) {
							optimalPropVec = currentPropVec;
							currentVector[key] = optimalPropVec;
						}
					}
				}
			}
			// console.log(currentVector);

			// 最优词性的筛选
			var targetVec = 0,
				targetProp = "";
			for (var key in props) {
				if (currentVector[key] > targetVec) {
					targetVec = currentVector[key];
					targetProp = key;
				}
			}

			//记录当前词的最优词性并将其他参数初始化
			if (targetProp != "") {
				this.propsList.push(targetProp);
			}
			// prevVector = currentVector; //  拷贝
			prevVector = this.clone(currentVector);
			currentVector = {};
			targetVec = 0;
			targetProp = "";
		}
		return this.propsList;
	},
	isEmptyObject: function(obj) { // 判断对象是否为空
		for (var key in obj) {
			return 0;
		}
		return 1;
	},
	clone: function(obj) { // 对象拷贝
		if (typeof(obj) != 'object' || obj == null) {
			return obj;
		}
		var newObj = {};
		for (var key in obj) {
			newObj[key] = this.clone(obj[key]);
			// newObj[key] = obj[key];
		}
		return newObj;
	}
};

module.exports = HMM;