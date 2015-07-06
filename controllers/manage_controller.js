var models = require("../models/models.js");
var util = require("../libs/utilities.js");
var uuid = require('node-uuid');
var nodemailer = require('nodemailer');

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

//POST /manager/createUser
exports.createUser = function(req, res) {
    var email = req.body.email;
    var uuid4 = uuid.v4();

    var user = models.User.build();
    user.email = email.toLowerCase();
    user.role = req.body.role;
    user.confirmationToken = uuid4;
    user.password = "none";

    var allowedEmail = /^(.*)\@(.*)\.(.*)$/;

    if (allowedEmail.test(email)) {

        //Envio del correo
        var link = "http://" + req.get('host') + "/manage/password/" + uuid4;

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
            html: "Hola,<br>Un administrador de placeForMe te a elegido para que te registres como gestor de la plataforma.<br>Haz clic en este link para elegir una contraseña para tu usuario.<br><a href=" + link + ">Entrar</a>"
        });

        //guardar en base de datos
        user.save().then(function(newAdmin) {
        	req.session.msg = [{"message": "se ha creado satisfactoriamente el usuario "+ user.email +" Con el rol: "+ req.body.role}];
        	
            //save log
            models.Logs.create({
                userID: req.session.user.id,
                controller: "Manage",
                action: "Create"+req.body.role,
                details: "newAdminID=" + newAdmin.id + ";email=" + newAdmin.email
            });
            res.redirect('/manager');
        });
    }else {
        req.session.errors = [{"message": 'Introduzca un correo válido.'}];
        req.session.where = 'users';
        res.redirect('/manager');
    }

};

//GET /manage/password/:token

exports.password = function(req, res, next) {
    var errors = req.session.errors || {};
    var token = req.param("token");
    req.session.errors = {};
    req.session.token = token;
    models.User.find({where: {confirmationToken: token}}).then(function(user) {
        if (user) {
            req.session.where = '';
            res.render('manager/password', {token: token,email: user.email,errors: errors});
        }else {
            next(new Error('No existe el Token= ' + token))
        }
    });
}

exports.putPassword = function(req, res, next) {

    console.log(" - La edicion de la contraseña de un usuario se a iniciado");
    var token = req.session.token;
    console.log(" - Dato que se recive desde token: " + token);

    models.User.find({where: {confirmationToken: token}}).then(function(user) {
        if (user) {
            console.log(" - Se ha elegido el usuario del modelo de datos (" + user.email + ")");
            user.isValidate = true;
            user.password = util.encrypt(req.body.put_password);
            user.locked = false;
            user.validate().then(function(err) {
                if (err) {
                    console.log(" - La validacion del usuario actualizado a dado ERROR");
                    req.session.where = '';
                    res.render('manager/password', {token: token,email: user.email,errors: err.errors});
                }
                else {
                    console.log(" - La validacion del usuario actualizado sin errores");
                    user.save().then(function() {
                        console.log(" - Usuario guardado correctamente, redireccionar a '/login'");
                        res.redirect('/login');
                    });
                }
            }).catch(function(error) {
                next(error);
            });
        }else {
            console.log(" - Error al elegir un usuario del modelo de datos (no se a podido sacar ninguno)");
            req.session.where = '';
            res.render('manager/password', {
                errors: [{
                    "message": 'Este usuario no esta a la espera de crear una contraseña'
                }]
            });
        }
    });
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
    	
    }).catch (function (err){
    	req.session.errors = [{"message": 'Ha ocurrido un error al editar el usuario'},
                              {"message": error.message}];
		res.redirect('/manager');
    });


    
};

//GET /manager/changelock/:userId
exports.changeLock = function(req, res) {
    req.user.locked = !req.user.locked;
    req.user.save().then(function() {
           //save log
        var action = (req.user.locked) ? "locked" : "unlocked";
        models.Logs.create({
            userID: req.session.user.id,
            controller: "Manage",
            action: "user " + action,
            details: "userID=" + req.user.id + ";email=" + req.user.email.toLowerCase()
        });
        req.session.msg = [{"message": 'Se ha '+((req.user.locked) ? "bloqueado" : "desbloqueado")+ ' el usuario '+req.user.email+' satisfactoriamente'}];
        res.redirect('/manager');
    }).catch(function(err) {
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
exports.changeUserRole = function(req,res){
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
}

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
}
