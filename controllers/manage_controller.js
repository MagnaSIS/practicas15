
var models = require("../models/models.js");
var util   = require("../includes/utilities.js");
var uuid = require('node-uuid');
var nodemailer = require('nodemailer');

//GET /manager
exports.new = function(req,res){
	models.User.findAll().then(function(user) {
        var errors=req.session.errors || {};
        req.session.errors={};
        
        var action=req.session.action || null;
        var userTmp=req.session.userTmp || null;
        console.log("action= "+req.session.action + "userTmp= "+req.session.userTmp);
        req.session.action=null;
        req.session.userTmp=null;
        
        res.render('manager/manage', { users: user, action: action, userTmp: userTmp, errors: errors});
    }
  ).catch(function(error) {
	  //no funciona correctamente
	  console.log(error);
	  next(new Error(error)); //Next no se utiliza cuando es el controlador final
	  });

};

//POST /manager
exports.create = function(req,res) {
    var email = req.body.email;
    var uuid4 = uuid.v4();

    var user = models.User.build();
    user.email = email;
    user.role = "MANAGER";
    user.confirmationToken = uuid4;
    user.password = "none";

    var allowedEmail = /^(([a-zA-Z])+(\d{3})+\@ikasle.ehu.eus$)/;

    if(allowedEmail.test(email)){

            //Envio del correo
            host = req.get('host');
            link = "http://"+req.get('host')+"/manage/password/"+uuid4;

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
                html : "Hola,<br>Un administrador de placeForMe te a elegido para que te registres como gestor de la plataforma.<br>Haz clic en este link para elegir una contraseña para tu usuario.<br><a href="+link+">Entrar</a>"
            });

            //guardar en base de datos
            user.save().then(function(){
            	 req.session.action="creado";
            	 req.session.userTmp="administrador " +user.email;
                res.redirect('/manager');
            });
    }
    else{
        req.session.errors =[{"message": 'El correo no es un correo de la UPV / EHU. Tiene que ser del tipo correo@ikasle.ehu.eus'}];
        res.redirect('/manager');
    }

};

exports.password = function(req,res){

        var errors = req.session.errors || {};
        req.session.errors = {};
        req.session.token = req.param("Id");
        console.log(" - El token se a agregado a la variable 'req.session.token' ("+req.session.token+")");
        models.User.find({
              where:{
                confirmationToken: req.param("Id")
              }
          }).then(function(user) {
              if (user) {
                console.log(" - Se va a renderizar la pagina de crear un passworddel usuario: " + user.email);
                res.render('manager/password', {token: req.param("Id"), email: user.email, errors: errors});
              } else{next(new Error('No existe el Token= ' + Id))}
            }
          )
}

exports.putPassword = function(req,res){

    console.log(" - La edicion de la contraseña de un usuario se a iniciado");
    var token = req.session.token;
    console.log(" - Dato que se recive desde token: " + token);

    models.User.find({where:{confirmationToken: token}}).then(function(user){
        if(user){
            console.log(" - Se a elegido el usuario del modelo de datos ("+user.email+")");
            user.isValidate = true;
            user.password = util.encrypt(req.body.put_password);
            user.locked = false;
            user.validate().then(function(err){
              if(err){
                console.log(" - La validacion del usuario actualizado a dado ERROR");
                res.render('manager/password', {token: req.param("Id"), email: user.email, errors: err.errors});
              }
              else{
                console.log(" - La validacion del usuario actualizado sin errores");
                user.save().then(function(){
                    console.log(" - Usuario guardado correctamente, redireccionar a '/login'");
                    res.redirect('/login');
                    });
              }
            }).catch(function(error){next(error)});
        }
        else{
            console.log(" - Error al elegir un usuario del modelo de datos (no se a podido sacar ninguno)");
            req.session.errors =[{"message": 'Este usuario no esta a la espera de crear una contraseña'}];
            res.render('manager/password', {errors: req.session.errors});

        }
    })

}

exports.destroy = function(req,res){

	console.log(" - La id que se va a borrar: " + req.param("userId"));

    req.user.destroy().then( function() {
   	 req.session.action="eliminado";
	 req.session.userTmp=req.user.email;
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
    
    	req.session.action="editado";
    	req.session.userTmp=req.user.email;
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

//GET /manager/changelock/:userId
exports.changeLock = function(req,res){
	req.user.locked=!req.user.locked;
	req.user.save().then(function(){
		req.session.action="desbloqueado";
		if (req.user.locked){
			req.session.action="bloqueado";
		}		
    	req.session.userTmp=req.user.email;
		res.redirect('/manager');
	}).catch(function(error){
		//Throw error...
	});
}