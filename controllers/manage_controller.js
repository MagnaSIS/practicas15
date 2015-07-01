var models = require("../models/models.js");
var util = require("../libs/utilities.js");
var uuid = require('node-uuid');
var nodemailer = require('nodemailer');

//GET /manager
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    models.User.findAll().then(function(user) {
        req.session.errors = {};
        var action = req.session.action || null;
        var userTmp = req.session.userTmp || null;
        //console.log("action= "+req.session.action + "userTmp= "+req.session.userTmp);
        req.session.action = null;
        req.session.userTmp = null;

        req.session.where = 'users';
        res.render('manager/manage', {
            users: user,
            action: action,
            userTmp: userTmp,
            errors: errors
        });
    }).catch(function(error) {
        req.session.where = 'users';
        res.render('manager/manage', {
            users: {},
            action: "",
            userTmp: "",
            errors: errors
        });
    });
};

//POST /manager
exports.create = function(req, res) {
    var email = req.body.email;
    var uuid4 = uuid.v4();

    var user = models.User.build();
    user.email = email.toLowerCase();
    user.role = "MANAGER";
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
            req.session.action = "creado";
            req.session.userTmp = "administrador " + user.email;

            //save log
            models.Logs.create({
                userID: req.session.user.id,
                controller: "Manage",
                action: "Create Admin",
                details: "newAdminID=" + newAdmin.id + ";email=" + newAdmin.email
            });
            res.redirect('/manager');
        });
    }
    else {
        req.session.errors = [{
            "message": 'Introduzca un correo válido.'
        }];
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
    models.User.find({
        where: {
            confirmationToken: token
        }
    }).then(function(user) {
        if (user) {
            console.log(" - Se va a renderizar la pagina de crear un password del usuario: " + user.email);
            req.session.where = '';
            res.render('manager/password', {
                token: token,
                email: user.email,
                errors: errors
            });
        }
        else {
            next(new Error('No existe el Token= ' + token))
        }
    });
}

exports.putPassword = function(req, res, next) {

    console.log(" - La edicion de la contraseña de un usuario se a iniciado");
    var token = req.session.token;
    console.log(" - Dato que se recive desde token: " + token);

    models.User.find({
        where: {
            confirmationToken: token
        }
    }).then(function(user) {
        if (user) {
            console.log(" - Se ha elegido el usuario del modelo de datos (" + user.email + ")");
            user.isValidate = true;
            user.password = util.encrypt(req.body.put_password);
            user.locked = false;
            user.validate().then(function(err) {
                if (err) {
                    console.log(" - La validacion del usuario actualizado a dado ERROR");
                    req.session.where = '';
                    res.render('manager/password', {
                        token: token,
                        email: user.email,
                        errors: err.errors
                    });
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
        }
        else {
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

exports.destroy = function(req, res) {

    req.user.destroy().then(function() {
        req.session.action = "eliminado";
        req.session.userTmp = req.user.email;
        //save log
        models.Logs.create({
            userID: req.session.user.id,
            controller: "Manage",
            action: "Delete user",
            details: "userID=" + req.user.id + ";email=" + req.user.email
        });

        res.redirect('/manager');
    }).catch(function(error) {
        req.session.errors = [{
            "message": 'Ha ocurrido un error al eliminar al usuario'
        }];
        res.redirect('/manager');
    });
};

exports.edit = function(req, res) {
    req.session.where = 'users';
    res.render('manager/edit', {
        user: req.user,
        errors: []
    });
};

exports.update = function(req, res) {

    var email = req.body.email;
    var password = req.body.password;
    var encrypt_password = util.encrypt(password);

    req.user.email = email.toLowerCase();
    req.user.password = encrypt_password;

    if (email != '')
        req.user.save({
            fields: ["email"]
        });
    if (password != '')
        req.user.save({
            fields: ["password"]
        });
    req.session.action = "editado";
    req.session.userTmp = req.user.email;
    //save log
    models.Logs.create({
        userID: req.session.user.id,
        controller: "Manage",
        action: "edit user",
        details: "userID=" + req.user.id + ";email=" + req.user.email.toLowerCase()
    });

    res.redirect('/manager');
};

//GET /manager/changelock/:userId
exports.changeLock = function(req, res) {
    req.user.locked = !req.user.locked;
    req.user.save().then(function() {
        req.session.action = "desbloqueado";
        if (req.user.locked) {
            req.session.action = "bloqueado";
        }
        req.session.userTmp = req.user.email;

        //save log
        var action = (req.user.locked) ? "locked" : "unlocked";
        models.Logs.create({
            userID: req.session.user.id,
            controller: "Manage",
            action: "user " + action,
            details: "userID=" + req.user.id + ";email=" + req.user.email.toLowerCase()
        });

        res.redirect('/manager');
    }).catch(function(error) {
        //Throw error...
    });
};

//GET manager/viewAllLogs
exports.viewLogs = function(req, res) {
    models.Logs.findAll().then(function(Logs) {
        req.session.where = 'logs';
        res.render('manager/logs', {
            logs: Logs,
            errors: []
        });
    }).catch(function(error) {
        req.session.where = 'logs';
        res.render('manager/logs', {
            logs: [],
            errors: error
        });
    });
};
