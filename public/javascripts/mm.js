$(document).ready(function() {
	var urlPrefix = '../model/';
	var App = {
		hintClose: function() {
			$('#hint').hide();
		},
		getMM: function() {
			var text = $.trim($('#input').val()),
				length = parseInt($('input[name=maxLength]').val());
			if (text == '' || length <= 0) {
				$('#hint').show();
				return;
			}
			$.ajax({
				'url': urlPrefix + 'getMM',
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
	$('#btn-mm').on('click', App.getMM);
	$('#icon-close').on('click', App.hintClose);
});