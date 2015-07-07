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

// controllers/student_controller.js

var models = require("../models/models.js");
var util = require("../libs/utilities.js");
var calcsController = require("../controllers/calcsController.js");
var uuid = require('node-uuid');
var mailer = require('../libs/mailer.js');

// GET /students
exports.new = function(req, res) {
	req.session.where='/students'; // No borrar, es para cuando comprueba si existe el usuario con el midleware de user_controller.notExistUser sepa donde volver y mostrar el error.
  var errors = req.session.errors || {};
  req.session.errors = {};
  var student = {
    name: "",
    surname: "",
    year: "",
    avgGrade: "",
    credits: "",
    specialisation: ""
  };
  var user = {
    email: ""
  };
  res.render('student/studentRegistration', {
    errors: errors,
    user: user,
    student: student
  });
  //res.write("Hola");
};

// POST /students
exports.create = function(req, res) {
	req.session.where='';
  var email = req.body.email;
  var password = req.body.password;
  var password1 = req.body.password1;
  var uuid4 = uuid.v4(); //id único para verificación del usuario

  //asignacion de valores al student
  var tmpYear = req.body.year;
  var tmpAvgGrade = parseFloat(req.body.avg); //idem
  var tmpCredits = req.body.credits; //idem
  var tmpSpecialisation = req.body.specialisation;

  var allowedEmail = /^([a-zA-Z]+\d{3})\@(ikasle.ehu)\.(es|eus)$/;
  var allowedName = /^[a-zA-Z ñÑáéíóúÁÉÍÓÚ]+$/;
  var allowedLastName = /^[a-zA-Z ñÑáéíóúÁÉÍÓÚ]+$/;

  //Verificacion de coincidencia de passwords
  if (password != password1) {
    req.session.errors = [{
      "message": 'Las contraseñas deben ser iguales'
    }];
    res.render('student/studentRegistration', {
      errors: req.session.errors
    });
  }
  else {
    password = util.encrypt(password);

//  var allowYear= /^([34])$/;
//  var allowAvgGrade= /^([\d+(\.\d+)?])$/;
  var allowAvgGrade= /^((\d\.\d[\d]?)|(10)(\.0)[0]?)$/;
//  var allowCredits= /^(([1]\d\d)|\d\d|([2][0-3]\d)|(240))$/;
//  var allowSpecialisation= /^(IS|IC|C)$/;
  /* TODO validar Student Y User antes de crearlos */
  if (allowedEmail.test(email) && allowedName.test(req.body.name) && allowedLastName.test(req.body.lastname)) {
    var emailMatch = email.match(allowedEmail);
    //guardar en base de datos
    models.User.create({
      email: (emailMatch[1] + '@' + emailMatch[2] + '.eus').toLowerCase(),
      password: password,
      confirmationToken: uuid4
    }).then(function(newUser) {
      models.Student.create({
        name: req.body.name,
        surname: req.body.lastname,
        year: tmpYear,
        avgGrade: tmpAvgGrade,
        credits: tmpCredits,
        specialisation: tmpSpecialisation
      }).then(function(newStudent) {
        newStudent.setUser(newUser).then(function(newStudent) {

          });
          //Envio del correo
          var link = "http://" + req.get('host') + "/students/verify/" + uuid4;
          mailer.sendUserConfirmationMail(newUser.email, link);

          req.session.errors = {};
          req.session.msg = [{message: "Te has registrado correctamente. Por favor, revisa tu bandeja de entrada de correo para confirmar tu usuario."}];
          res.redirect('/login');
        }).catch(function(error) {
    	  //catch en la creacion del student
          var errors = [{"message": 'Ha ocurrido un error en el registro'},
                                {"message": error.message}];
          newUser.destroy().then(function() {
            var student = {
              name: req.body.name,
              surname: req.body.lastname,
              year: tmpYear,
              avgGrade: tmpAvgGrade,
              credits: tmpCredits,
              specialisation: tmpSpecialisation
            };
            res.render('student/studentRegistration',{
              errors: errors,
              user: newUser,
              student: student
            });
        }); //borrar el usuario ya que no ha creado el student..
        if(isNaN(tmpAvgGrade)){ tmpAvgGrade = "";}
        var student = {
          name: req.body.name,
          surname: req.body.lastname,
          year: tmpYear,
          avgGrade: tmpAvgGrade,
          credits: tmpCredits,
          specialisation: tmpSpecialisation
        };
        res.render('student/studentRegistration',{
          errors: errors,
          user: newUser,
          student: student,
        });
      });
    }).catch(function(error) {
    	req.session.errors = [{"message": 'Ha ocurrido un error en el registro'},
    	                      {"message": error.message}];
    	res.redirect('/students');
    });
  }

    else {
      if (!allowedEmail.test(email)) {
        req.session.errors = [{
          "message": 'El correo no es un correo de la UPV / EHU. Tiene que ser del tipo correo@ikasle.ehu.eus'
        }];
      }
      if (!allowedName.test(name)) {
        req.session.errors = [{
          "message": 'El nombre debe tener letras'
        }];
      }
      if (!allowedLastName.test(apellidos)) {
        req.session.errors = [{
          "message": 'El apellido debe tener letras'
        }];
      }
      if (!allowAvgGrade.test(tmpAvgGrade)) {
        req.session.errors = [{
          "message": 'La nota media debe ser entre 0.0 y 10.0'
        }];
      }
      req.session.where = '';
      res.render('student/studentRegistration', {
        errors: req.session.errors
      });
      if (!allowAvgGrade.test(tmpAvgGrade)) {
        req.session.errors = [{
          "message": 'La nota media debe ser entre 0.0 y 10.0'
        }];
      }
      req.session.where = '';
      res.render('student/studentRegistration', {
        errors: req.session.errors
      });
    }
  }
};

// GET /modifipass
exports.formPassword = function(req, res) {
  var errors = req.session.errors || [];
  req.session.errors=[];
  //console.log('Mensaje de Formulario');
  req.session.where = '';
  console.log(errors);
  res.render('session/form', {
    errors: errors
  });
  //res.write("Hola");
};

// GET /modifipass/okpass
exports.mostrarOK = function(req, res, next) {
  var emailRegex = /^(.*)\@(.*)\.(.*)$/i;
  var email = req.body.email;
  var emailMatch = email.match(emailRegex);
  if (emailMatch) {
    if (emailMatch[2] === "ikasle.ehu") {
      email = emailMatch[1] + '@' + emailMatch[2] + '.eus';
    }
  }
  models.User.find({
    where: {
      email: email
    }
  }).then(
    function(user) {
      if (user) {
        user.confirmationToken = uuid.v4();
        user.save({
          fields: ['confirmationToken']
        }).then(function(user) {
          var link = "https://" + req.get('host') + "/modifipass/" + user.confirmationToken + "/edit";
          //Envio del correo
          mailer.sendResetPasswordMail(user.email, link);
          req.session.where = '';
          req.session.msg = [{
            message: "Se te ha enviado un correo electrónico. Por favor, revisa tu bandeja de entrada."
          }];
          res.redirect("/");
        });
      }
      else {
        req.session.errors = [{
          message: "No existe un usuario con el correo introducido."
        }];
        res.redirect('/modifipass');
      }
    }
  ).catch(function(error) {
    next(error);
  });
};

// GET /modifipass/:token/edit
exports.editPassword = function(req, res) {
  //console.log('Aqui llego 0');
  var user = req.user; // req.user: autoload de instancia de course

  //console.log(req.user);
  req.session.where = '';

  res.render('session/editpass', {
    user: user,
    errors: []
  });
};

// POST /modifipass/:token
exports.updatePassword = function(req, res, token) {

    var password = req.body.changepass;
    var encrypt_password = util.encrypt(password);

    req.user.password = encrypt_password;
    req.user.confirmationToken = '';
    req.user
      .validate()
      .then(
        function(err) {
          if (err) {
            req.session.where = '';
            res.render('session/editpass', {
              user: req.user,
              errors: err.errors
            });
            //console.log('Aqui llego pass2');
          }
          else {
            //console.log('Aqui llego pass3');
            req.session.msg = [{message: "Contraseña modificada correctamente"}];
            req.user // save: guarda campos pregunta y respuesta en DB
              .save({
                fields: ["password", "confirmationToken"]
              })
              .then(function() {
                res.redirect('/login');
              });
            //console.log('Aqui llego pass4');
          }
      }
    );
};

// GET /students/verify/:verificationToken - Modificación en base de datos sobre su existencia.
exports.verify = function(req, res) {
  models.User.findOne({
    where: {
      confirmationToken: req.params.verificationToken
    }
  }).then(function(user) {
    if (user) {
      /* TODO mostrar mensaje de exito */
      user.isValidate = true;
      user.save().then(function() {
        res.redirect('/login');
      }).catch(function(error) {
        //console.log("Error al actualizar usuario");
        req.session.where = '';
        res.render('error', {
          message: "Error al actualizar usuario",
          error: {},
          errors: error
        });
      });
    }
    else {
      //console.log("Usuario no encontrado");
      req.session.where = '';
      res.render('error', {
        message: "Usuario no encontrado",
        error: {},
        errors: {}
      });
    }
  }).catch(function(err) {
    //console.log("Error al actualizar usuario");
    req.session.where = '';
    res.render('error', {
      message: "Error al actualizar usuario",
      error: {},
      errors: {}
    });
  });
};

// GET /students/edit
exports.edit = function(req, res) {
  models.Student.findOne({
    where: {
      UserId: req.session.user.id
    }
  }).then(function(student) {
    req.session.where = 'account';
    res.render('student/edit', {
      student: student,
      errors: []
    });
  });
};

// PUT /students/update
exports.update = function(req, res, next) {
  models.Student.findOne({
    where: {
      UserId: req.session.user.id
    }
  }).then(function(student) {

    student.name = req.body.name_edit;
    student.surname = req.body.surname_edit;
    student.avgGrade = req.body.avg_edit;
    student.credits = req.body.credits_edit;
    student.year = req.body.year_edit;
    student.specialisation = req.body.specialisation_edit;
    student.validate().then(function(err) {
      if (err) {
        req.session.where = 'users';
        res.render('student/edit', {
          student: student,
          errors: err.errors
        });
      }
      else {
        student.save({
          fields: ["name", "surname", "specialisation", "year", "avgGrade", "credits"]
        }).then(function(student) {
          req.session.where = 'users';
          res.render('student/edit', {
            student: student,
            errors: [],
            msg: [{message: "Cambios realizados correctamente."}]
          });
        });
      }
    }).catch(function(error) {
      next(error);
    });
  });
};

/* GET /students/courses
 * Show Students Available courses
 */
exports.courses = function(req, res) {
  models.Course.findAll({
    include: {
      model: models.Student,
    }
  }).then(function(courses) {
    if (courses) {
      models.Student.findOne({
        where: {
          UserId: req.session.user.id
        }
      }).then(function(student) {
        if (student) {
          models.StudentCourse.findAll({
            where: {
              StudentId: student.id
            }
          }).then(function(userInCourses) {
            if (userInCourses) {
              req.session.where = 'my_courses';
              res.render('student/courses.ejs', {
                courses: courses,
                userCourses: userInCourses,
                student: student,
                errors: []
              });
            }
            else {
              req.session.where = 'my_courses';
              res.render('student/courses.ejs', {
                courses: courses,
                userCourses: [],
                errors: []
              });
            }
          }).catch(function(error) {
            req.session.where = 'my_courses';
            res.render('student/courses.ejs', {
              courses: [],
              userCourses: [],
              errors: error
            });
          });
        }
      }).catch(function(error) {
        console.log("error cach2");
        req.session.where = 'my_courses';
        res.render('student/courses.ejs', {
          courses: [],
          userCourses: [],
          errors: error
        });
      });
    }
  }).catch(function(error) {
    console.log("error cach3");
    req.session.where = 'my_courses';
    res.render('student/courses.ejs', {
      courses: [],
      total: [],
      errors: error
    });
  });
};

/*
 * POST /students/manageCourses
 * Edit student course preferences
 */
exports.manageCourses = function(req, res) {
  models.Student.findOne({
    where: {
      UserId: req.session.user.id
    }
  }).then(function(student) {
    models.Course.findById(req.body.courseID).then(function(course) {
      req.body.redirect = '/students/courses';
      if (req.body.add === "yes") {
        student.getCourses().then(function(total) {
          student.addCourse(course, {
            student_priority: total.length + 1,
            course_position: 0
          }).then(function() {
            calcsController.recalculateMinNote(req, res, course);
          }).catch(function(error) {
            req.session.error = "error al añadir estudiate al curso cath0= " + error;
            res.redirect('/students/courses');
          });
        }).catch(function(error) {
          req.session.error = "error al añadir estudiate al curso cath0= " + error;
          res.redirect('/students/courses');
        });

      }
      else {
        models.StudentCourse.findOne({
          where: {
            StudentId: student.id,
            CourseId: course.id
          }
        }).then(function(studentCourse) {
          var deletedPosition = studentCourse.student_priority;
          studentCourse.destroy().then(function() {
            //Recalcular preferencias
            models.StudentCourse.findAll({
              where: {
                StudentId: student.id
              }
            }).then(function(userInCourses) {
              userInCourses.forEach(function(courseTmp) {
                if (courseTmp.student_priority > deletedPosition) {
                  courseTmp.student_priority--;
                  courseTmp.save();
                }
              });
              calcsController.recalculateMinNote(req, res, course);
            });
          }).catch(function(error) {
            req.session.error = "error Deleting Student Course = " + error;
            res.redirect('/students/courses');
          });
        }).catch(function(error) {
          req.session.error = "error manageCourses cath0= " + error;
          res.redirect('/students/courses');
        });
      }
    }).catch(function(error) {
      req.session.error = "error manageCourses cath1= " + error;
      res.redirect('/students/courses');
    });
  }).catch(function(error) {
    req.session.error = "error manageCourses cath2= " + error;
    res.redirect('/students/courses');
  });
};

// POST /students/courses/select -- via AJAX
exports.select = function(req, res) {
  var response = {};
  models.Student.findOne({
    where: {
      UserId: req.session.user.id
    }
  }).then(function(student) {
    models.Course.findById(req.body.id, {
      include: {
        model: models.Student
      }
    }).then(function(course) {
      student.addCourse(course).then(function() {
        response.lleno = (course.Students.length >= course.vacancies);
        response.inscritos = [0, 0, 0, 0, 0];
        for (var i = 0; i < course.Students.length; i++)
          response.inscritos[course.Students[i].year]++;
        response.inscritos[student.year]++;
        res.send(response);
      });
    }).catch(function(error) {
      res.send(null);
    });
  }).catch(function(error) {
    res.send(null);
  });
};

// POST /students/courses/remove -- via AJAX
exports.remove = function(req, res) {
  var response = {};
  models.Student.findOne({
    where: {
      UserId: req.session.user.id
    }
  }).then(function(student) {
    models.Course.findById(req.body.id, {
      include: {
        model: models.Student
      }
    }).then(function(course) {
      student.removeCourse(course).then(function() {
        response.inscritos = [0, 0, 0, 0, 0];
        for (var i = 0; i < course.Students.length; i++)
          response.inscritos[course.Students[i].year]++;
        response.inscritos[student.year]--;
        res.send(response);
      });
    }).catch(function(error) {
      res.send(null);
    });
  }).catch(function(error) {
    res.send(null);
  });
};

exports.contact = function(req, res) {

    req.session.where = 'contact';
    mensaje = req.session.msg;
    req.session.msg = {};
    res.render('contact');

};
exports.contactStudent = function(req, res) {

    models.Student.findOne({
      where: {
        UserId: req.session.user.id
      }}).then(function(student) {
      req.session.where = 'contact';
      mensaje = req.session.msg;
      req.session.msg = {};
      console.log("ENTRA");
      res.render('student/contactStudent', {
        student: student,
        email: req.session.user.email,
        errors: [],
        msg: mensaje
      });
    });
};
