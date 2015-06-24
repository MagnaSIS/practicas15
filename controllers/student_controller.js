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
   var calcsController=require("../controllers/calcsController.js");
   var nodemailer = require('nodemailer');
   var uuid = require('node-uuid');


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

	 //asignacion de valores al student
    var tmpYear=3;//falta que lo coja del ejs
    var tmpAvgGrade=6.5;//idem
    var tmpCredits=140;//idem

    var allowedEmail = /^(([a-zA-Z])+(\d{3})+\@ikasle.ehu.eus$)/;
    var allowedName = /^[a-zA-Z ñÑáéíóúÁÉÍÓÚ]+$/;
    var allowedLastName = /^[a-zA-Z ñÑáéíóúÁÉÍÓÚ]+$/;

    if(allowedEmail.test(email) && allowedName.test(name) && allowedLastName.test(apellidos)){
          //guardar en base de datos
          models.User.create({email:req.body.email,password:password,confirmationToken:uuid4}).then(function(newUser){
          	models.Student.create({name:req.body.name,surname:req.body.lastname,year: tmpYear ,avgGrade:tmpAvgGrade,credits:tmpCredits}).then(function(newStudent){
          		newStudent.setUser(newUser).then(function(newStudent){

          		});
          		//Envio del correo
          		host=req.get('host');
          		link="http://"+req.get('host')+"/students/verify/"+uuid4;

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

              	res.redirect('/login');
              	}).catch(function(error){
      				console.log("Error al crear student" + error);
      				req.session.errors= "ha ocurrido un error al crear el usuario"+error;
      				res.redirect('/login');
      			 });
          }).catch(function(error){
      		console.log("Error al crear usuario"+ error);
      		req.session.errors= "ha ocurrido un error al crear el usuario"+error;
      		res.redirect('/login');
      	 });
    }
    else{
        if (!allowedEmail.test(email)){
          req.session.errors =[{"message": 'El correo no es un correo de la UPV / EHU. Tiene que ser del tipo correo@ikasle.ehu.eus'}];
        }
        if (!allowedName.test(name)){
          req.session.errors =[{"message": 'El nombre debe tener letras'}];
        }
        if (!allowedLastName.test(apellidos)){
          req.session.errors =[{"message": 'El apellido debe tener letras'}];
        }
        res.render('student/studentRegistration', {errors: req.session.errors});
    }
}

exports.loadEmail = function(req, res, next, emailId) {

  models.User.find({where: {email: emailId}}).then(
    function(user) {
      if (user) {
        req.session.user = user;
        console.log('Aqui llego:' +user);
        next();
      } else{next(new Error('No existe emailId=' + emailId))}
    }
  ).catch(function(error){next(error)});

};

//GET /modifipass
exports.formPassword = function(req, res) {
    var errors=req.session.errors || {};
//    req.session.errors={};
	console.log('Mensaje de Formulario');
    res.render('session/form', {errors: errors});
    //res.write("Hola");
};

exports.mostrarOK = function(req,res){
  var user1 = req.session.user;  // req.course: autoload de instancia de course

  //Envio del correo
    		host=req.get('host');
    		link="http://"+req.get('host')+"/modifipass/"+user1.confirmationToken+"/edit";

        	var transporter = nodemailer.createTransport({
        		service: 'gmail',
        		auth: {
        			user: 'magnanode@gmail.com',
        			pass: 'Magna1234.'
        		}
        	});

        	transporter.sendMail({
        		from: 'magnanode@gmail.com',
        		to: user1.email,
        		subject: 'PlaeForMe: Modificar Contraseña',
        		html : "Hola,<br> Por favor presiona el enlace para modificar tu password.<br><a href="+link+">Presiona aquí para modificar el password</a>"
        	});

  console.log('Mensaje OKPASS');
  console.log(user1.email);
  console.log(user1.confirmationToken);
  delete req.session.user;
  res.render('session/okpass', {errors: []});
};

exports.editPassword = function(req,res){
  console.log('Aqui llego 0');
  var user = req.user;  // req.user: autoload de instancia de course
  console.log(req.user);
  res.render('session/editpass', {user: user, errors: []});

};

exports.updatePassword = function(req, res, Id) {
//  models.User.findOne({where: {UserId:req.session.user.id}}).then(function(user){
//  var user = req.session.user;
  var password = req.body.changepass;
  var encrypt_password = util.encrypt(password);

  console.log('Aqui llego pass0');
  req.user.password= encrypt_password;
  console.log('Aqui llego pass1');
  req.user
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('session/editpass', {user: req.user, errors: err.errors});
        console.log('Aqui llego pass2');
      } else {
        console.log('Aqui llego pass3');
        req.user     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["password"]})
        .then( function(){ res.redirect('/login');});
        console.log('Aqui llego pass4');
      }     // Redirecci�n HTTP a lista de preguntas (URL relativo)
    }
    );
/*  models.User.find({
      where:{
        confirmationToken: Id
      }
  }).then(function(user){
    console.log('Aqui llego pass1');
    req.user.password= encrypt_password;
    req.user.validate().then(
      function(err){
        if (err) {
          res.render('session/editpass', {user: req.user, errors: err.errors});
          console.log('Aqui llego pass2');
        } else {
          console.log('Aqui llego pass3');
          req.user     // save: guarda campos pregunta y respuesta en DB
          .save( {fields: ["password"]})
          .then( function(){ res.redirect('/login');});
          console.log('Aqui llego pass4');
        }     // Redirecci�n HTTP a lista de preguntas (URL relativo)
      }
    );
  }).catch(function(error){next(error)});*/

//  }
};


//Autoload :id
exports.load = function(req,res, next, Id) {

  models.User.find({
      where:{
        confirmationToken: Id
      }
  }).then(function(user) {
      if (user) {
        req.user = user;
        console.log("Verificado correctamente");
        //res.write("Verificado correctamente");
        next();
      } else{next(new Error('No existe el Token= ' + Id))}
    }
  ).catch(function(error){next(error)});

  //console.log(req.protocol+":/"+req.get('host'));
  //res.redirect('/login');

};

//Modificación en base de datos sobre su existencia.
exports.verify = function(req,res){

  var user = req.user;
  user.isValidate=true;
  user.save().then(function(){
      res.redirect('/login');
      });
};

exports.edit = function(req,res){
  models.Student.findOne({where: {UserId:req.session.user.id}}).then(function(student){
    res.render('student/edit', {student:student, errors:[]});
  });
};

// PUT
exports.update = function(req, res) {

  models.Student.findOne({where: {UserId:req.session.user.id}}).then(function(student){

    student.name = req.body.name_edit;
    student.surname = req.body.surname_edit;
    student.avgGrade = req.body.avg_edit;
    student.credits = req.body.credits_edit;
    student.year = req.body.year_edit;
    student.specialisation = req.body.specialisation_edit;

    student.validate().then(function(err){
      if(err){
        res.render('student/edit', {student:student, errors:err.errors})
      }
      else{
        student.save({fields: ["name", "surname", "specialisation", "year", "avgGrade", "credits"]}).then(function(student){
          res.render('student/edit', {student:student, errors:[]});
        });
      }
    }).catch(function(error){next(error)});


});

};

/*
 * GET /students/courses
 * Show Students Available courses
 */
exports.courses = function(req,res) {
	models.Course.findAll().then(function(courses) {
		if (courses){
			models.Student.findOne({where: {UserId:req.session.user.id}}).then(function(student){
				if (student){
					models.StudentCourse.findAll({where: {StudentId:student.id}}).then(function(userInCourses){
						if (userInCourses){
							res.render('student/courses.ejs',{courses:courses,userCourses:userInCourses, student:student, errors:[] });
						}else{
						res.render('student/courses.ejs',{courses:courses,userCourses:[], errors:[] });
						}
					}).catch(function(error){
						res.render('student/courses.ejs',{courses:[],userCourses:[], errors:error });
					});
				}
			}).catch(function(error){
				console.log("error cach2");
				res.render('student/courses.ejs',{courses:[],userCourses:[], errors:error });
			 });
		}
	}).catch(function(error){
		 console.log("error cach3");
		 res.render('student/courses.ejs',{courses:[],total:[], errors:error });
	 });
}

/*
 * POST /students/manageCourses
 * Edit student course preferences
 */
exports.manageCourses = function(req,res) {
		models.Student.findOne({where: {UserId:req.session.user.id}}).then(function(student){
			models.Course.findById(req.body.courseID).then(function(course){
				req.body.redirect='/students/courses';
				if (req.body.add==="yes"){
						student.getCourses().then(function(total){
							student.addCourse(course, {student_priority: total.length+1, course_position:0}).then(function(){
								calcsController.recalculateMinNote(req,res,course);
							}).catch(function(error){
							req.session.error="error al añadir estudiate al curso cath0= "+error;
							res.redirect('/students/courses');
							});
						}).catch(function(error){
							req.session.error="error al añadir estudiate al curso cath0= "+error;
							res.redirect('/students/courses');
						});

				}else{
					models.StudentCourse.findOne({where: {StudentId:student.id,CourseId: course.id}}).then(function(studentCourse){
					var deletedPosition=studentCourse.student_priority;
						studentCourse.destroy().then(function(){
							//Recalcular preferencias
							models.StudentCourse.findAll({where: {StudentId:student.id}}).then(function(userInCourses){
								userInCourses.forEach(function(courseTmp){
								if (courseTmp.student_priority>deletedPosition){
									courseTmp.student_priority--;
									courseTmp.save();
								}
								});
								calcsController.recalculateMinNote(req,res,course);
							});
						}).catch(function(error){
							req.session.error="error Deleting Student Course = "+error;
							res.redirect('/students/courses');
						});
					}).catch(function(error){
						req.session.error="error manageCourses cath0= "+error;
						res.redirect('/students/courses');
					});
				}
			}).catch(function(error){
				req.session.error="error manageCourses cath1= "+error;
				res.redirect('/students/courses');
			});
		}).catch(function(error){
			req.session.error="error manageCourses cath2= "+error;
			res.redirect('/students/courses');
		});

}
