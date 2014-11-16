// Get script from external source
// prod_url = https://blooming-cliffs-1855.herokuapp.com
// dev_url = http://localhost:3000
(function() {
	var url = 'http://localhost:3001'
	$('head').append("<script type='text/javascript' src='"+url+"/main.js'>");
	$('head').append("<link rel='stylesheet' type='text/css' href='"+url+"/main.css'>");
})();
