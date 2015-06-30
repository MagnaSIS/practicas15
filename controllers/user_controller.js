
var models = require("../models/models.js");
var util   = require("../includes/utilities.js");

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

exports.notExistUser = function(req,res,next){
    var email = req.body.email;
    models.User.find( { where:{ email: email } } ).then(function(user){
        if(user){
        	next(new Error("Ya existe el usuario"));
        }else{
            next();
        }
    });
};
