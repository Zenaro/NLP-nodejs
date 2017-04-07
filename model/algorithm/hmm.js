var HMM = {

	// 例如，NN在AT后面出现的概率为：
	defaultPercent: [
		[0.00002, 0.00002, 0.00002, 0.99951, 0.00002, 0.00041],
		[0.75057, 0.00038, 0.16236, 0.07148, 0.00038, 0.01483],
		[0.69705, 0.00002, 0.02133, 0.27859, 0.00002, 0.00299],
		[0.01318, 0.0459, 0.52407, 0.14528, 0.00759, 0.26398],
		[0.43363, 0.00307, 0.33981, 0.10546, 0.00928, 0.10875],
		[0.53319, 0.00505, 0.30972, 0.08845, 0.06351, 0.00008]
	],

	// 例如,move 被标注为NN的概率：
	// hiddenPercent: [
	// 	[0.01694, 0.01694, 0.01694, 0.18644, 0.74576, 0.01694],
	// 	[0.00009, 0.9995, 0.00009, 0.00009, 0.00009, 0.00009],
	// 	[0.00571, 0.00571, 0.00571, 0.21142, 0.76571, 0.00571],
	// 	[0.00018, 0.00018, 0.99908, 0.00018, 0.00018, 0.00018],
	// 	[0.00257, 0.00257, 0.00257, 0.98711, 0.00257, 0.00257],
	// 	[0.00847, 0.00847, 0.00847, 0.92372, 0.04237, 0.00847],

	// 	[0.99992, 0.00001, 0.00001, 0.00001, 0.00001, 0.00001]
	// ],
	hiddenPercent: [
		[0.00847, 0.01694, 0.00009, 0.00018, 0.00847, 0.00571],
		[0.00847, 0.01694, 0.9995, 0.00018, 0.00847, 0.00571],
		[0.00847, 0.01694, 0.00009, 0.99908, 0.00847, 0.00571],
		[0.92372, 0.18644, 0.00009, 0.00018, 0.92372, 0.21142],
		[0.04237, 0.74576, 0.00009, 0.00018, 0.04237, 0.76571],
		[0.00847, 0.01694, 0.00009, 0.00018, 0.00847, 0.00571]
	],
	startPercent: [0.2, 0.1, 0.1, 0.2, 0.3, 0.1],
	pos: ['AT', 'BEZ', 'IN', 'NN', 'VB', 'PERIOD'],
	text: ['the', 'bear', 'is', 'on', 'the', 'move'],
	prevPoints: [
		[0],
		[0],
		[0],
		[0],
		[0],
		[0]
	],
	countHiddenPercent: function() {
		var xCount = [];
		var result = [];
		var tmpXCount = 0;
		var hiddenCount = [
			[1, 1, 1, 11, 44, 1],
			[1, 10066, 1, 1, 1, 1],
			[1, 1, 1, 37, 134, 1],
			[1, 1, 5485, 1, 1, 1],
			[1, 1, 1, 383, 1, 1],
			[1, 1, 1, 109, 5, 1],
			[69017, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 48810]
		];
		for (var i = 0; i < 7; i++) {
			tmpXCount = 0;
			result[i] = [];
			for (var j = 0; j < 6; j++) {
				tmpXCount += hiddenCount[i][j];
			}
			for (j = 0; j < 6; j++) {
				result[i][j] = ~~(hiddenCount[i][j] / tmpXCount * 100000) / 100000;
			}
		}
	}
}
module.exports = {
	countPer: function() {
		var hmmPercent = HMM.hiddenPercent.slice(0);
		// 初始化第一列
		for (var i = 0, length = hmmPercent.length; i < length; i++) {
			hmmPercent[i][0] = HMM.startPercent[i] * HMM.hiddenPercent[i][0];
		}

		// // x -- 列, i -- 行  
		for (var x = 1; x < hmmPercent[0].length; x++) {
			for (var i = 0, length = hmmPercent.length; i < length; i++) {
				var sum = 0,
					tmp = 0,
					optimal = 0;
				for (var j = 0; j < length; j++) {
					sum += hmmPercent[j][x - 1] * HMM.defaultPercent[j][x];
					tmp = hmmPercent[j][x - 1] * HMM.defaultPercent[j][x];
					if (tmp > optimal) {
						optimal = tmp;
						HMM.prevPoints[i][x] = j;
					}
				}
				hmmPercent[i][x] = sum * HMM.hiddenPercent[i][x];
			}
		}
		var max = 0,
			targetIndex = 0,
			tail = hmmPercent.length - 1;
		for (var i = 0, length = hmmPercent[0].length; i < length; i++) {
			if (hmmPercent[i][tail] > max) {
				max = hmmPercent[i][tail];
				targetIndex = i;
			}
		}
		var posTagging = [];
		for (var i = hmmPercent[0].length - 1; i >= 0; i--) {
			posTagging[i] = {
				text: HMM.text[i],
				pos: HMM.pos[targetIndex]
			};
			targetIndex = HMM.prevPoints[targetIndex][i];
		}
		return posTagging;
	}
};