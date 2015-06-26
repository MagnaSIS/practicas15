
var models = require("../models/models.js");
var util   = require("../libs/utilities.js");

exports.checkUserId = function(req, res, next, userId) {
  models.User.findById(userId).then(
    function(user) {
      if (user) {
        req.user = user;
        next();
      } else{next(new Error("No existe el usuario"))}
    }
  ).catch(function(error){next(error)});

};

exports.changeLock = function(req,res){

	console.log(' - Iniciando cambio de bloqueo');
	console.log(' - Email del user seleccionado: ' + req.user.email);
	if(req.user.locked){
		req.user.locked = false;
	}
	else{
		req.user.locked = true;
	}
	req.user.save();
	res.redirect('/manager');

}
