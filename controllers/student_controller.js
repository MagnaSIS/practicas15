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

    //guardar en base de datos
    models.User.create({email:req.body.email,password:password,confirmationToken:uuid4}).then(function(newUser){   	
    	models.Student.create({name:req.body.name,surname:req.body.lastname,year: tmpYear ,avgGrade:tmpAvgGrade,credits:tmpCredits}).then(function(newStudent){
    		newStudent.setUser(newUser).then(function(newStudent){
    			
    			
    		});



    		//Envio del correo
    		host=req.get('host');
    		link="http://"+req.get('host')+"/students/verify/"+uuid4;

        	var transporter = nodemailer.createTransport({
        		ervice: 'gmail',
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