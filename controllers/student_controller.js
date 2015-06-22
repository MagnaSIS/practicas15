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

    //asignacion de valores al user
    user.email=req.body.email;
    user.password=password;
    user.confirmationToken=uuid4;

    //asignacion de valores al student
    student.name=req.body.name;
    student.surname=req.body.lastname;
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
        link="http://"+req.get('host')+"/students/"+uuid4;

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
    student.save({fields: ["name", "surname", "specialisation", "year", "avgGrade", "credits"]}).then(function(student){
      res.render('student/edit', {student:student, errors:[]});
    });
});

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


*/



  /*req.course.name  = req.body.course.name;
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
  );*/
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
					student.getCourses().then(function(userInCourses){
						if (userInCourses){
							res.render('student/courses.ejs',{courses:courses,userCourses:userInCourses, errors:[] });
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
				if (req.body.add==="yes"){	
					/* 
					 * Por Completar
					 * Recalcular posiciones (alumno desapuntado de asignatura)
					 */
					var priority=0;
					var position=0;
					student.addCourse(course, {student_priority: priority, course_position:position}).then(function(){
						res.redirect('/students/courses');						
					}).catch(function(error){
						req.session.error="error manageCourses cath0= "+error;
						res.redirect('/students/courses');
					});	
				}else{
					models.StudentCourse.destroy({where: {StudentId:student.id,CourseId: course.id}}).then(function(){
						/* Por Completar
						 * Recalcular posiciones (alumno desapuntado de asignatura)
						 */res.redirect('/students/courses');						
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