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
   var nodemailer = require('nodemailer');
   var uuid = require('node-uuid');

   var crypto = require('crypto');
   var algorithm = 'aes-256-ctr';
   var password;




//GET /controllers/student
exports.new = function(req, res) {
    var errors=req.session.errors || {};
    req.session.errors={};
    res.render('student/studentRegistration', {errors: errors});
    //res.write("Hola");
    };

//Post /controllers/student
exports.create = function(req,res) {
    var name = req.body.name;
    var apellidos = req.body.lastname;
    var email = req.body.email;
    password = req.body.password;
    console.log(password);
    var user = models.User.build();//creacion del user
    var student=models.Student.build();//creacion del student
    var uuid4 = uuid.v4(); //id único para verificación del usuario
    password = util.encrypt(password);

    console.log(password);
    //asignacion de valores al user
    user.email=email;
    user.password=password;
    user.confirmationToken=uuid4;

    //asignacion de valores al student
    student.name=name;
    student.surname=apellidos;
    student.year=3;//falta que lo coja del ejs
    student.avgGrade=6.5;//idem
    student.credits=140;//idem

    console.log(req.get('host'));

   // console.log(user.password);
    //guardar en base de datos
    user.save();
    student.save().then(function(){
        res.redirect('/login');
        });

        //Envio del correo
        host=req.get('host');
        link="http://"+req.get('host')+"/verify?id="+uuid4;

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
          subject: 'Por favor verifica tu cuenta de correo',
          html : "Hola,<br> Por favor presiona el enlace para verificar tu correo.<br><a href="+link+">Presiona aquí para verificar</a>"
    });



    };

//verificacion de existencia
exports.load = function(req,res, next, Id) {

  console.log("Muestra el Id que llega por la URL: "+ Id);
  models.User.find({
      where:{
        confirmationToken: Id
      }
  }).then(function(user) {
      if (user) {
        req.user = user;
        console.log("Verificado correctamente");
        res.write("Verificado correctamente");
        next();
      } else{next(new Error('No existe userId= ' + Id))}
    }
  ).catch(function(error){next(error)});

  console.log(req.protocol+":/"+req.get('host'));
  res.redirect('/login');

};

//Modificación en base de datos sobre su existencia.
exports.verify = function(req,res){

  console.log("Verify");
  res.write("Verify");
  res.redirect('/login');
/*
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
*/

};



//TODO GOnzalo
/*
//DELETE /controllers/student
exports.destroy = function(req, res) {

  req.

};


// DELETE /course/:id
exports.destroy = function(req, res) {
  req.course.destroy().then( function() {
    res.redirect('/course/allcourses');
  }).catch(function(error){next(error)});
};

//Delete /logout session destroy
exports.destroy = function (req,res){
	delete req.session.user;
	res.redirect("/");
};

exports.destroy = function(req,res){

	console.log(" - La id que se va a borrar: " + req.param("userId"));

    //borrar el user con la id que nos da
    req.user.destroy().then( function() {
        res.redirect('/manager');
    }).catch(function(error){next(error)});

};

//PUT /controllers/student



// PUT /course/:id
exports.update = function(req, res) {
  req.course.name  = req.body.course.name;
  req.course.description = req.body.course.description;
  req.course.specialisation  = req.body.course.specialisation;
  req.course.credits = req.body.course.credits;
  req.course.vacancies = req.body.course.vacancies;

  req.course
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('course/edit', {course: req.course, errors: err.errors});
      } else {
        req.course     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["name", "description", "specialisation", "credits", "vacancies"]})
        .then( function(){ res.redirect('/course');});
      }     // Redirecci�n HTTP a lista de preguntas (URL relativo)
    }
  );
};
*/
