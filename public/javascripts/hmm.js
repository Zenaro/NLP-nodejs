$(document).ready(function() {
	var urlPrefix = '../model/';
	var App = {
		hintClose: function() {
			$('#hint').hide();
		},
		getHMM: function() {
			var text = $.trim($('#input').val()),
				length = parseInt($('input[name=maxLength]').val());
			if (text == '' || length <= 0) {
				$('#hint').show();
				return;
			}
			$.ajax({
				'url': urlPrefix + 'getHMM',
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
	$('#btn-req').on('click', App.getHMM);
	$('#icon-close').on('click', App.hintClose);
});