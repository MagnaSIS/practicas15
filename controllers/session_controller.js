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

var models = require("../models/models.js");
var util = require("../libs/utilities.js");



// MW - comprueba si el usuario está identificado
exports.loginRequired = function(req, res, next) {
	if (req.session.user) {
		next();
	}
	else {
		req.session.errors = [{
			message: "Necesitas iniciar sesión para acceder a esta página."
		}];
		res.redirect('/login');
	}
};

// MW - comprueba si el rol del usuario es uno de los propuestos (role1 ó role2 ó role3)
exports.roleRequired = function(role1, role2, role3) {
	return function(req, res, next) {
		if (req.session.user) {
			var role = req.session.user.role;
			if (role === role1 || role === role2 || role === role3) {
				next();
			}
		}
		else {
			/* TODO creo que no funciona*/
			res.status(405).send("Acceso denegado.");
		}
	};
};

// MW - si el usuario esta identificado, elimina su sesion.
exports.anonRequired = function(req, res, next) {
	if (req.session.user) {
		/* TODO igual cambiar */
		delete req.session.user;
	}
	next();
};

// GET /login - Login Form
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	var msg = req.session.msg || {};
	req.session.errors = {};
	req.session.msg = {};
	req.session.where = '';
	res.render('session/login', {
		errors: errors,
		msg: msg
	});
};

//POST /login - Login check
exports.create = function(req, res) {
	var emailRegex = /^(.*)\@(.*)\.(.*)$/i;
	var email = req.body.login;
	var emailMatch = email.match(emailRegex);
	if (emailMatch) {
		if (emailMatch[2] === "ikasle.ehu" && emailMatch[3].match(/^(es|eus)$/)) {
			email = emailMatch[1] + '@' + emailMatch[2] + '.eus';
		}
	}
	models.User.find({
		where: {
			email: email.toLowerCase(),
			password: util.encrypt(req.body.password)
		}
	}).then(function(user) {
		if (user) {
			var error = false;
			if (!user.isValidate) {
				error = true;
				//console.log('Correo no validado');
				req.session.errors = [{
					"message": 'Su cuenta no está activada. Por favor revise su correo electrónico para activarla. ' 
						+ 'Si no ha recibido un correo para activar su cuenta, haga click <a href="/user/resend?id=' + user.id + '">aquí</a> para volver a recibirlo.'
				}];
			}

			if (user.locked) {
				error = true;
				//console.log('Usuario bloqueado');
				req.session.errors = [{
					"message": 'Cuenta bloqueada. Ponte en contacto con un administrador.'
				}];
			}
			if (!error) {
				req.session.msg = [{
					message: "Has iniciado sesión como " + user.email + " ¡Bienvenido!"
				}];
				req.session.user = {
					email: user.email,
					role: user.role,
					id: user.id
				};
				res.redirect("/");
			} else {
				res.redirect("/login");
			}
		}
		else {
			req.session.errors = [{
				"message": 'Correo o contraseña incorrectos'
			}];
			res.redirect("/login");
		}
	}).catch(function(error) {
		req.session.errors = [{
			"message": 'Correo o contraseña incorrectos'
		}, {
			"message": ("error: " + error) || ""
		}];
		res.redirect("/login");
	});
};

// DELETE /logout - session destroy
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect("/");
};
