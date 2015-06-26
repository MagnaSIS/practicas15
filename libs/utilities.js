/**  
 *   placeForMe -
 *   Copyright (C) 2015 by Magna SIS <magnasis@magnasis.com>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

exports.encrypt = (function(password){
	var crypto = require('crypto');
	return (crypto.createHash('sha256').update(password).digest('base64'));
});


exports.requiredSecureConection = function (req,res,next){
	var url = "https://"+ req.headers.host + ':'+ process.env.SECUREPORT+req.url;
	console.log("local port= " + process.env.PORT);
	console.log("local Secureport= " + process.env.SECUREPORT);
	console.log("url="+url);
	
	if (!req.secure) {
		 console.log("no secure Connection");
		 res.redirect(url);
	 }else{
		 console.log("Secure Connection");
		 next();
	 }
};
