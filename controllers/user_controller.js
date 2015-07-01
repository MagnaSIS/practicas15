// controllers/user_controller.js

var models = require("../models/models.js");
var util = require("../libs/utilities.js");
var uuid = require('node-uuid');
var nodemailer = require('nodemailer');

exports.notExistUser = function(req, res, next) {
  var email = req.body.email;
  models.User.find({
    where: {
      email: email
    }
  }).then(function(user) {
    if (user) {
      next(new Error("Ya existe el usuario"));
    }
    else {
      next();
    }
  });
};

exports.checkUserId = function(req, res, next, userId) {
	models.User.findById(userId).then(
		function(user) {
			if (user) {
				req.user = user;
				next();
			}
			else {
				next(new Error("No existe el usuario"))
			}
		}
	).catch(function(error) {
		next(error)
	});

};

// POST /admin
exports.create = function(req, res, next) {

	var email = req.body.email;
	var uuid4 = uuid.v4();

	var user = models.User.build();
	user.email = email;
	user.role = req.body.role;
	user.confirmationToken = uuid4;
	user.password = "none";

	var allowedEmail = /^((.)+\@(.)+\.(.)+$)/;

	if (allowedEmail.test(email)) {

		//Envio del correo
		var host = req.get('host');
		var link = "http://" + req.get('host') + "/user/confirm?token=" + uuid4;

		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'magnanode@gmail.com',
				pass: 'Magna1234.'
			}
		});

		transporter.sendMail({
			from: 'magnanode@gmail.com',
			to: email,
			subject: 'Registro del gestor en placeForMe',
			html: "Hola,<br>Un administrador de placeForMe te a elegido para que te registres como administrador de la plataforma.<br>Haz clic en este link para elegir una contraseña para tu usuario.<br><a href=" + link + ">Entrar</a>"
		});

		//guardar en base de datos
		user.save().then(function() {
			res.redirect('/manager');
		});
	}
	else {
		req.session.errors = [{
			"message": 'El correo no es un correo válido.'
		}];
		/* TODO no funciona porque el render exige parametro users*/
		req.session.where = 'users';
		res.render('manager/manage', {
			errors: req.session.errors
		});
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
			res.status(404).send(new Error('Página no encontrada'));
		}
	});
};
