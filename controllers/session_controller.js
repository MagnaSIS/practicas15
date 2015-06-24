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
		if (req.session.user && req.session.user.role === "STUDENT"){
			next();
		}else{
			next(new Error("Permiso denegado."));
		}
};

//Check if user is Manager
exports.isManager = function (req,res,next){
		if (req.session.user && req.session.user.role === "MANAGER"){
			next();
		}else{
			next(new Error("Permiso denegado."));
		}
};

//Check if user is Admin
exports.isAdmin = function (req,res,next){
		if (req.session.user && req.session.user.role === "ADMIN"){
			next();
		}else{
			next(new Error("Permiso denegado."));
		}
};

//Check if user is Admin
exports.isCourseAdmin = function (req,res,next){
		if ( req.session.user && (req.session.user.role === "ADMIN") || (req.session.user.role === "MANAGER")){
			next();
		}else{
			next(new Error("Permiso denegado."));
		}
};

//Get /login Login Form
exports.new = function(req,res){
		var errors=req.session.errors || {};
		req.session.errors={};
		res.render('session/login', {errors : errors});
};

//Post /login Login check
exports.create = function(req,res){
	models.User.find({where: {email: req.body.login, password: util.encrypt(req.body.password)}}).then(function(user) {
		if (user) {
			var error=false;
			if (!user.isValidate){
				error=true;
				console.log('Correo no validado');
				req.session.errors =[{"message": 'Correo no validado'}];
			}

			if (user.locked){
				error=true;
				console.log('Usuario bloqueado');
				req.session.errors =[{"message": 'Cuenta bloqueada'}];
			}
			if (!error){
				req.session.user = {email: user.email, role: user.role, id: user.id};
			}
		} else{
			console.log('Usuario o contraseña incorrectas');
			req.session.errors =[{"message": 'Usuario o contraseña incorrectas'}];
		}
		res.redirect("/login");
	}).catch(function(error){
		req.session.errors =[{"message": 'Usuario o contraseña incorrectas'} , {"message":("error: " + error) || ""}];
		res.redirect("/login");
	});
};

//Delete /logout session destroy
exports.destroy = function (req,res){
	delete req.session.user;
	res.redirect("/");
};

exports.isValidate = function (req,res,next){
		if (req.session.user.role === "MANAGER"){
			next();
		}else{
			next(new Error("Permiso denegado."));
		}
};
