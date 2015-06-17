
var models=require("../models/models.js");
var util=require("../includes/utilities.js");

exports.new = function(req,res){
	res.render('manager/manage');
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