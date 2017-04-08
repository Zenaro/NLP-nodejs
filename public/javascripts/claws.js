$(document).ready(function() {
	var urlPrefix = '../model/';
	var App = {
		hintClose: function() {
			$('#hint').hide();
		},
		getCLAWS: function() {
			var text = $.trim($('#input').val()),
				length = parseInt($('input[name=maxLength]').val());
			if (text == '' || length <= 0) {
				$('#hint').show();
				return;
			}
			$.ajax({
				'url': urlPrefix + 'getCLAWS',
				'type': 'get',
				'data': {
					'string': text,
					'length': length
				},
				'dataType': 'json',
				'success': function(res) {
					if (res.status == 1) {
						$('#output').text(res.result);
					}
				}
			});
		}
	};
	$('#btn-mm').on('click', App.getCLAWS);
	$('#icon-close').on('click', App.hintClose);
});