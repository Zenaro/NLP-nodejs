const wordReader = require('../fileReader/wordReader.js');
module.exports = {
	forwardMaximumMatching: function(string, maxLength) {
		maxLength = parseInt(maxLength);
		if (typeof string !== 'string' || typeof maxLength !== 'number') {
			throw new Error("参数错误: 函数 maximumMatching(string, length)");
		}
		var tmp = '',
			index = 0,
			result = [],
			currentLength = maxLength;
		while (index < string.length) {
			if (string.length - index < currentLength) {
				currentLength = string.length - index;
			}
			tmp = string.substring(index, index + currentLength);
			if (wordReader.hasOwnProperty(tmp)) {
				result.push(tmp);
				index += currentLength; // 指针向右移动
				currentLength = maxLength; // 重置currentLength
			} else if (currentLength > 1) {
				currentLength -= 1; // 减少剪切的长度

			} else {
				result.push("词典中未收录'" + tmp + "'这个词");
				index += currentLength;
				currentLength = maxLength;
			}
		}
		return result;
	}
}