/**  
 *   placeForMe -
 *   Copyright (C) 2015 by Magna SIS <magnasis@magnasis.com>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var models=require("../models/models.js");
var util=require("../includes/utilities.js");

//Check if user is login
exports.loginRequired = function (req,res,next){
		if (req.session.user){
			next();
		}else{
			res.redirect('login');
		}
};

//Check if user is Student
exports.isStudent = function (req,res,next){
		if (req.session.role === "STUDENT"){
			next();
		}else{
			new Error("Permiso denegado.")
		}
};

//Check if user is Manager
exports.isManager = function (req,res,next){
		if (req.session.role === "MANAGER"){
			next();
		}else{
			new Error("Permiso denegado.")
		}
};

//Check if user is Admin
exports.isAdmin = function (req,res,next){
		if (req.session.role === "ADMIN"){
			next();
		}else{
			new Error("Permiso denegado.")
		}
};


//Get /login Formulario de login
exports.new = function(req,res){
	//var errors=req.session.errors || {};
	//req.session.errors={};
	//res.render('session/new',{errors:errors});
	res.render('session/login');
};

//Post /login crear la sesion
exports.create = function(req,res){
	var login= req.body.login;
	var pass = req.body.password;
    pass = util.encrypt(pass);
	
	models.User.find({where: {email: login, password: pass}}).then(function(user) {
		if (user) {
			console.log("email= " + user.email + "\n role= " + user.role);
			
			req.session.user = {email: user.email, role: user.role};
			res.redirect("/login");
			return;
		} else{
			req.session.errors =[{"message": 'usuario o contraseña incorrectas'}];
			res.redirect("/login");
			return;
		}
	}).catch(function(error){
		console.log("Error:" + error);
		//next(error);
		});
};
	
//Delete /logout destruir sesion
exports.destroy = function (req,res){
	delete req.session.user;
	res.redirect(req,session.redir.toString());
};	
