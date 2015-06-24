
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