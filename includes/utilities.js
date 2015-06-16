
var encrypt = (function(password){
	var crypto = require('crypto');
	return (crypto.createHash('sha256').update(password).digest('base64'));
});

exports.encrypt = encrypt;
