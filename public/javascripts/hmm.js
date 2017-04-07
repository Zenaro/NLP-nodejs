$(document).ready(function() {
	var urlPrefix = '../model/';
	var App = {
		getHMM: function() {
			$.ajax({
				'url': urlPrefix + 'getHMM',
				'type': 'get',
				'dataType': 'json',
				'success': function(res) {
					var string = "";
					console.log(res);
					$(res).each(function(index, value) {
						string += value["text"] + "/" + value["pos"] + "  ";
					});
					$('#output').text(string);
				}
			});
		}
	};
	$('#btn-hmm').on('click', App.getHMM);
});