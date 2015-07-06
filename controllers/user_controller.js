// controllers/user_controller.js

var models = require("../models/models.js");
var uuid = require('node-uuid');
var mailer = require('../libs/mailer.js');
var hasher = require('../libs/utilities.js');

// MW que asegura que no existe el usuario
exports.notExistUser = function(req, res, next) {
	var email = req.body.email;

	models.User.find({
		where: {
			email: email.toLowerCase()
		}
	}).then(function(user) {
		if (user) {
			/* TODO cambiar el error devuelto */
			next(new Error("Ya existe el usuario"));
		}
		else {
			next();
		}
	});
};

// Autoload - carga el usuario con id userId
exports.checkUserId = function(req, res, next, userId) {
	models.User.findById(userId).then(
		function(user) {
			if (user) {
				req.user = user;
				next();
			}
			else {
				next(new Error("No existe el usuario"));
			}
		}
	).catch(function(error) {
		next(error);
	});
};

// POST /user - Crea un usuario ADMIN o MANAGER
exports.create = function(req, res, next) {

	var email = req.body.email;
	var uuid4 = uuid.v4();

	var user = models.User.build();
	user.email = email.toLowerCase();
	user.role = req.body.role;
	user.confirmationToken = uuid4;
	user.password = "none";

	var allowedEmail = /^((.)+\@(.)+\.(.)+$)/;

	if (allowedEmail.test(email)) {

		//Envio del correo
		var link = "http://" + req.get('host') + "/user/confirm?token=" + uuid4;

		mailer.sendUserConfirmationMail(email, link);

		//guardar en base de datos
		user.save().then(function(newUser) {
			req.session.action = "creado";
			req.session.userTmp = "administrador " + user.email;

			//save log
			models.Logs.create({
				userID: req.session.user.id,
				controller: "User",
				action: "Create " + user.role,
				details: "newUserID=" + newUser.id +
					";newUserEmail=" + newUser.email
			});
			/* TODO mostrar mensaje de exito */
			res.redirect('/manager');
		});
	}
	else {
		req.session.errors = [{
			"message": 'El correo no es un correo válido.'
		}];
		req.session.where = 'users';
		res.redirect('/manager');
	}
};

// GET user/confirm
exports.confirm = function(req, res, next) {
	var token = req.query.token;
	var errors = req.session.errors || {};
	req.session.errors = {};
	req.session.token = token;
	models.User.find({
		where: {
			confirmationToken: token,
		}
	}).then(function(user) {
		if (user) {
			req.session.where = '';
			res.render('manager/password', {
				token: token,
				email: user.email,
				errors: errors
			});
		}
		else {
			req.session.where = '';
			res.status(404).render('error', {
				message: "Página no encontrada.",
				error: new Error('404: Página no encontrada.')
			});
		}});
};

// POST user/confirm
exports.setPassword = function(req, res, next) {
	/* TODO en la vista 'manager/password', pedir repeticion de contraseña y mostrar tooltips.*/
	var token = req.body.token;

	models.User.find({
		where: {
			confirmationToken: token
		}
	}).then(function(user) {
		if (user) {
			user.isValidate = true;
			user.password = hasher.encrypt(req.body.put_password);
			user.locked = false;
			user.confirmationToken = '';
			user.validate().then(function(err) {
				if (err) {
					console.log(user);
					req.session.where = '';
					res.render('manager/password', {
						token: token,
						email: user.email,
						errors: err.errors
					});
				}
				else {
					user.save().then(function() {
						//console.log(" - Usuario guardado correctamente, redireccionar a '/login'");
						req.session.msg = [{
							'message': "Cuenta activada correctamente."
						}];
						res.redirect('/login');
					});
				}
			}).catch(function(error) {
				next(error);
			});
		}
		else {
			/* TODO No funciona el error. Falta el atributo email porque no existe el usuario*/
			req.session.where = '';
			res.status(404).render('error', {
				message: "404: Página no encontrada.",
				error: new Error('404: Página no encontrada.')
			});
		}
	});
};

// Autoload para cambiar password
exports.checkToken = function(req, res, next, token) {

	models.User.find({
		where: {
			confirmationToken: token
		}
	}).then(function(user) {
		if (user) {
			req.user = user;
			//console.log("Verificado correctamente");
			//res.write("Verificado correctamente");
			next();
		}
		else {
			next(new Error('No existe el Token= ' + token));
		}
	}).catch(function(error) {
		next(error);
	});

	//console.log(req.protocol+":/"+req.get('host'));
	//res.redirect('/login');

};
