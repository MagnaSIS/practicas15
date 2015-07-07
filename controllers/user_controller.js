// controllers/user_controller.js

var models = require("../models/models.js");
var uuid = require('node-uuid');
var mailer = require('../libs/mailer.js');
var hasher = require('../libs/utilities.js');

// MW que asegura que no existe el usuario
exports.notExistUser = function(req, res, next) {
  /* TODO cambiar el email en caso de que sea 'ikasle.ehu.es' > 'ikasle.ehu.eus' */
  var email = req.body.email;
  models.User.find({where: {email: email.toLowerCase()}}).then(function(user) {
    if (user) {
    	req.session.errors = [{"message": 'Ya existe el usuario'}];
    	var backUrl=req.session.req.session.where;
    	req.session.where="";
    	res.redirect(backUrl);
    }else {
    	req.session.backurl="";
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

// GET /user/resend
exports.resend = function(req, res, next) {
	var userId = req.query.id;
	models.User.findById(userId).then(function(user) {
		if (user) {
			if (user.isValidate) {
				res.status(404).render('error', {
					message: "404: Página no encontrada.",
					error: new Error('404: Página no encontrada.')
				});
			}
			else {
				var link = "http://" + req.get('host') + "/students/verify/" + user.confirmationToken;
				mailer.sendUserConfirmationMail(user.email, link);
				req.session.msg = [{
					'message': "Se ha enviado un mensaje a su correo para confirmar su cuenta."
				}];
				res.redirect('/login');
			}
		}
		else {
			res.status(404).render('error', {
				message: "404: Página no encontrada.",
				error: new Error('404: Página no encontrada.')
			});
		}
	}).catch(function(error) {
	    res.status(500).render('error', {
	    	message: error.message,
	    	error: error,
	    });
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
