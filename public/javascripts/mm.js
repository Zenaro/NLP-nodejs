$(document).ready(function() {
	var urlPrefix = '../model/';
	$.ajax({
		'url': urlPrefix + 'getMM',
		'type': 'get',
		'data': {
			'string': '我在餐厅吃饭'
		},
		'success': function(res) {
			console.log(res);
		}
	});
});