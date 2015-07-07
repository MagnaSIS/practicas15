var models = require("../models/models.js");
var util = require("../libs/utilities.js");
var uuid = require('node-uuid');
var mailer = require('../libs/mailer.js');

//GET /manager
exports.index = function(req, res) {
    var errors = req.session.errors || {};
    var msgs = req.session.msg || {};
    
    models.User.findAll().then(function(user) {
        req.session.errors = {};
        req.session.msg = {};

        req.session.where = 'users';
        req.session.backurl='/manager';
        res.render('manager/manage', {users: user, errors: errors, msg:msgs});
        
    }).catch(function(error) {
        req.session.where = 'users';
        res.render('manager/manage', {users: {},action: "",userTmp: "",errors: errors});
    });
};

/* movidas funciones create y password al controlador user */

//POST /manager/createUser
exports.createUser = function(req, res) {
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

//Delete /manager/deleteUser/:userId
exports.deleteUser = function(req, res) {
    req.user.destroy().then(function() {

        //save log
        models.Logs.create({
            userID: req.session.user.id,
            controller: "Manage",
            action: "Delete user",
            details: "userID=" + req.user.id + ";email=" + req.user.email
        });
        req.session.msg = [{"message": 'Se ha eliminado el usuario '+req.user.email+' satisfactoriamente'}];
        res.redirect('/manager');
    }).catch(function(error) {
        req.session.errors = [{"message": 'Ha ocurrido un error al eliminar al usuario'}];
        res.redirect('/manager');
    });
};

//GET /editUser/:userId(\\d+)
exports.editUser = function(req, res) {
    req.session.where = 'users';
    res.render('manager/edit', {user: req.user});
};

//PUT /editUser/:userId(\\d+)
exports.updateUser = function(req, res) {
    req.user.email = req.body.email.toLowerCase();
    req.user.password = util.encrypt(req.body.password);
    req.user.save().then (function(){
    	//save log
        models.Logs.create({
            userID: req.session.user.id,
            controller: "Manage",
            action: "edit user",
            details: "userID=" + req.user.id + ";email=" + req.user.email.toLowerCase()
        });
        req.session.msg = [{"message": 'Se ha editado el usuario '+req.user.email+' satisfactoriamente'}];
        res.redirect('/manager');
    	
    }).catch (function (error){
    	req.session.errors = [{"message": 'Ha ocurrido un error al editar el usuario'},
                              {"message": error.message}];
		res.redirect('/manager');
    });


    
};

//GET /manager/changelock/:userId
exports.changeLock = function(req, res) {
    req.user.locked = !req.user.locked;
    var action = (req.user.locked) ? "locked" : "unlocked";
    req.user.save().then(function() {
           //save log
        models.Logs.create({
            userID: req.session.user.id,
            controller: "Manage",
            action: "user " + action,
            details: "userID=" + req.user.id + ";email=" + req.user.email.toLowerCase()
        });
        req.session.msg = [{"message": 'Se ha '+((req.user.locked) ? "bloqueado" : "desbloqueado")+ ' el usuario '+req.user.email+' satisfactoriamente'}];
        res.redirect('/manager');
    }).catch(function(error) {
    	req.session.errors = [{"message": 'Ha ocurrido un error al '+action+ ' el usuario '+req.user.email},
                              {"message": error.message}];
    });
};

//GET /manager/viewAllLogs
exports.viewLogs = function(req, res) {
    models.Logs.findAll().then(function(Logs) {
        req.session.where = 'logs';
        res.render('manager/logs', {logs: Logs});
    }).catch(function(error) {
        req.session.where = 'logs';
        res.render('manager/logs', {logs: [],errors: error});
    });
};

//POST '/manager/changeUserRole/:userId'
/*exports.changeUserRole = function(req,res){
	if (req.body.role==="MANAGER" || req.body.role==="STUDENT"){
		req.user.role=req.body.role;
		req.user.save({fields: ["role"]}).then(function() {
			if (req.body.role==="STUDENT"){
				models.Student.count({where: {userId:req.user.id }}).then(function (result){
					if (result==1){ //ya existe el tipo student
						//save log
						models.Logs.create({
							userID: req.session.user.id,
							controller: "Manage",
							action: "change Role to " + req.body.role,
							details: "userID=" + req.user.id + ";email=" + req.user.email.toLowerCase()
						});
						 req.session.msg = [{"message": 'Se ha cambiado el rol satisfactoriamente al usuario '+req.user.email}];
						res.redirect('/manager');
					}else{ //crear el tipo student para el usuario
						res.render('manager/newStudent', {user: req.user});
					}
				});
			}else{
				 req.session.msg = [{"message": 'Se ha cambiado el rol satisfactoriamente al usuario '+req.user.email}];
				res.redirect('/manager');
			}
		}).catch(function(error) {
			req.session.errors = [{"message": 'Ha ocurrido un error al cambiar el rol al usuario'},
	                              {"message": error.message}];
			res.redirect('/manager');
		});	
	}else{
		req.session.errors = [{"message": 'Rol incorrecto...'}];
        res.redirect('/manager');
	}
};*/

//POST '/manager/createStudent/:userId'
exports.createStudentFromUser = function(req,res){
	models.Student.create({
        name: req.body.name,
        surname: req.body.lastname,
        year: req.body.year,
        avgGrade: parseFloat(req.body.avg),
        credits: req.body.credits,
        specialisation: req.body.specialisation
      }).then(function(newStudent) {
        newStudent.setUser(req.user).then(function(newStudent) {
        	models.Logs.create({
				userID: req.session.user.id,
				controller: "Manage",
				action: "change Role to STUDENT",
				details: "userID=" + req.user.id + ";email=" + req.user.email.toLowerCase()
			});		
			req.session.msg = [{"message": 'Estudiante creado satisfactoriamente'}];
        	res.redirect('/manager');
        });
      }).catch(function(error) {
			req.session.errors = [{"message": 'Ha ocurrido un error al cambiar el rol al usuario'},
	                              {"message": error.message}];
			res.redirect('/manager');
		}); 
};
