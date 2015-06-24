
var models = require("../models/models.js");
var util   = require("../includes/utilities.js");

exports.load = function(req, res, next, userId) {

  models.User.findById(userId).then(
    function(user) {
      if (user) {
        req.user = user;
        next();
      } else{next(new Error('No existe userId=' + userId))}
    }
  ).catch(function(error){next(error)});

};

exports.new = function(req,res){

	models.User.findAll().then(
    function(user) {
        var errors=req.session.errors || {};
        req.session.errors={};
        res.render('manager/manage', { users: user, errors: errors});
    }
  ).catch(function(error) { next(error);})

};

exports.create = function(req,res) {

    var email = req.body.email;
    var password = req.body.password;
    console.log("Password en texto-plano: " + password);

    var user = models.User.build();//creacion del user
    password = util.encrypt(password);
    console.log("Password encriptado: " + password);

    //asignacion de valores al user
    user.email = email;
    user.password = password;
    user.role = "MANAGER";

    //guardar en base de datos
    user.save().then(function(){
        res.redirect('/manager');
    });

};

exports.destroy = function(req,res){

	console.log(" - La id que se va a borrar: " + req.param("userId"));

    //borrar el user con la id que nos da
    req.user.destroy().then( function() {
        res.redirect('/manager');
    }).catch(function(error){next(error)});

};

exports.edit = function(req,res){

    console.log(" - La id del usuaro que se va a editar: " + req.param("userId"));
    res.render('manager/edit', { user: req.user, errors: []});

};

exports.update = function(req,res){

    var email = req.body.email;
    var password = req.body.password;
    var encrypt_password = util.encrypt(password);

    console.log(" - Email: " + email + " || Password: " + password + " || Encrypt_Password: " + encrypt_password);

    req.user.email = email;
    req.user.password = encrypt_password;

    if(email != '')
        req.user.save({fields: ["email"]});
    if(password != '')
        req.user.save({fields: ["password"]});

    res.redirect('/manager');


};

exports.notExistManager = function(req,res,next){

    var email = req.body.email;

    console.log(" - Correo: " + email);
    models.User.find( { where:{ email: email } } ).then(function(user){
        if(user){
            console.log("TIENE QUE SALTAR EL ERROR");
            req.session.errors =[{"message": 'Este usuario ya existe'}];
            res.redirect('manager');
        }
        else{
            console.log("NO TIENE QUE SALTAR");
            next();
        }
    });
};

exports.notExistStudents = function(req,res,next){

    var email = req.body.email;

    console.log(" - Correo: " + email);
    models.User.find( { where:{ email: email } } ).then(function(user){
        if(user){
            console.log("TIENE QUE SALTAR EL ERROR");
            req.session.errors =[{"message": 'Este usuario ya existe'}];
            res.redirect('students');
        }
        else{
            console.log("NO TIENE QUE SALTAR");
            next();
        }
    });
};
