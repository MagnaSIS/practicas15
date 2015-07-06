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

var util = require("../libs/utilities.js");
var models = require('../models/models.js');


exports.isAdmin = function(req, res, next) {
	if (req.session.user) {
		if (req.session.user && req.session.user.role === "ADMIN") {
			next();
		}else{
			 models.Logs.create({
		            userID: req.session.user.id,
		            controller: "Security",
		            action: "Attempting to access to restricted area",
		            details: "userID=" + req.user.id + ";email=" + req.user.email
		        });			 
			next(new Error("Permiso denegado."));
		}		
	}else {
		req.session.errors = [{message: "Necesitas iniciar sesión para acceder a esta página."}]
		res.redirect('/login');
	}
};