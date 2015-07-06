var models = require("../models/models.js");
var util = require("../libs/utilities.js");
var uuid = require('node-uuid');
var mailer = require('../libs/mailer.js');

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

/* movidas funciones create y password al controlador user */

// DELETE /manager/:userId - elimina el usuario con Id :userId
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

// GET /manager/:userId/edit - muestra el formulario de edicion de un usuario
exports.edit = function(req, res) {
    req.session.where = 'users';
    res.render('manager/edit', {
        user: req.user,
        errors: []
    });
};

// PUT /manager/:userId - actualiza los datos les usuario :userId
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
        /* TODO control de errores en changelock */
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
