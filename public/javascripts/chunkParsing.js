$(document).ready(function() {
	var myApiKey = 'Y14111Q2R7lwXtsf0dSvYRyJBAJAdeNyLeai8tLj';
	var App = {
		hintClose: function() {
			$('#hint').hide();
		},
		getCP: function() {
			var text = $.trim($('#input').val());
			if (text == '') {
				$('#hint').show();
				return;
			}
			var timer = setInterval(function() { // 服务器不稳定，故需要轮询直到结果正确
				$.ajax({
					'url': 'http://api.ltp-cloud.com/analysis/',
					'type': 'get',
					'data': {
						'api_key': myApiKey,
						'text': text,
						'pattern': 'all',
						'format': 'json'
					},
					'dataType': 'jsonp',
					'success': function(res) {
						if (Object.prototype.toString.call(res) == '[object Array]') { // 正确的结果
							clearInterval(timer);
							var target = res[0][0];
							var string = "";
							for (var i = 0, length = target.length; i < length; i++) {
								string += target[i].cont + "/" + target[i].pos + " ";
							}
						}
						$("#output").text(string);
					}
				});
			}, 800);
		}
	};
	$('#btn-cp').on('click', App.getCP);
	$('#icon-close').on('click', App.hintClose);
});