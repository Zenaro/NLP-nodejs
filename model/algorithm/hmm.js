// 隐马尔可夫模型
var fileReader = require('../fileReader/wordPropReader');
var HMM = {
	graph: [ // 切割字符串后附带上对应所有词性的对象，示例如下:
		/*{
			"我": {
				'r': 1501
			}
		}, {
			"在": {
				"p": 1201,
				"v": 15034 "n": 130
			}
		}*/
	],
	point: [0
		/*, // 第一个词"我"无前驱 
				{ // 第二个词"在"有词性[p,v,n]
					'p': 'r', // 表示p的最优前驱为r
					'v': 'r',
					'n': 'r'
				}*/
	],
	propsList: [], // 词性标注成功后的最终数组[r, p, v, n]

	/*
	 * 获取最优路径 
	 * @ param: mmList--字符串切割后的数组:["我"，"在", "餐厅","吃饭"]
	 * @ return: 最优路径 this.propsList
	 */
	getOptimalPath: function(mmList) {
		this.graph = fileReader.getGraph(mmList);
		// 获取字典 hash
		var wordPropDic = fileReader.getWordPropDic();
		var propPropDic = fileReader.getPropPropDic();
		var propDic = fileReader.getPropDic();

		var prevVector = {}, // 收录前驱指针及其概率的hash表 {'prop1': percent, 'prop2': percent} 
			currentVector = {}; // 收录当前词性及概率的hash表 {'prop1': percent, 'prop2': percent}

		// 对 graph 进行遍历
		for (var i = 0, length = this.graph.length; i < length; i++) {
			var word = mmList[i]; // 字符依次为 "我" -- "在" -- "餐厅" -- "吃饭"
			var props = this.graph[i][word]; // 字符的所有词性

			// 遍历词性  [p, v, n]
			for (var key in props) {
				if (this.isEmptyObject(prevVector)) { // 首次则处理为<BOS>
					var countXY = propPropDic["<BOS>" + key] == undefined ?
						1 : propPropDic["<BOS>" + key]; // 对0 进行平滑处理
					var countX = propDic["<BOS>"];

					currentVector[key] = countXY / countX * wordPropDic[word + key] / propDic[key];

				} else { // 非首次则需要计算当前词性的最优前驱指针
					var maxPrevPercent = 0, // 最优前驱的概率
						curPrevPercent = 0, // 当前前驱的概率
						maxPrevPoint = null; // 最优前驱的指针
					for (var k in prevVector) { // 对前驱的所有词性进行遍历
						var countXY = propPropDic[k + key] == undefined ?
							1 : propPropDic[k + key]; // 对0进行平滑处理
						var countX = propDic[k];
						curPrevPercent = prevVector[k] * countXY / countX * wordPropDic[word + key] / propDic[key];

						// 保留本次词性的最优前驱
						if (curPrevPercent > maxPrevPercent) {
							maxPrevPercent = curPrevPercent;
							// currentVector[key] = maxPrevPercent;
							maxPrevPoint = k;
						}
					}
					// 前驱遍历结束后将最优概率存入currentVector[key]
					currentVector[key] = maxPrevPercent;
					// this.point[i] = {};
					if (this.point[i] == undefined) {
						this.point[i] = {};
					}
					this.point[i][key] = maxPrevPoint;
				}
			}

			// 将其他参数初始化
			prevVector = this.clone(currentVector); // 拷贝
			currentVector = {};
			targetPercent = 0;
			targetProp = "";
		}
		// 对最后一列进行最优词性的筛选（此时prevVector刚好指向最后一列）
		var targetPercent = 0,
			targetProp = "";
		for (var key in prevVector) {
			if (prevVector[key] > targetPercent) {
				targetPercent = prevVector[key];
				targetProp = key;
			}
		}
		var tail = this.graph.length - 1;
		for (var i = 0; i <= tail; i++) {
			this.propsList[i] = "";
		}
		this.propsList[tail] = targetProp;
		// 得到最后一列的最优词性后，开始进行回溯
		for (var i = this.point.length - 1; i > 0; i--) {
			// console.log(this.point[i][this.propsList[i]]);
			this.propsList[i - 1] = this.point[i][this.propsList[i]];
		}
		console.log(this.point);
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