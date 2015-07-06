var models = require('../models/models.js');

// Autoload :id
exports.load = function(req, res, next, courseId) {
  models.Course.findById(courseId).then(
    function(course) {
      if (course) {
        req.course = course;
        next();
      }
      else {
        next(new Error('No existe courseId=' + courseId));
      }
    }
  ).catch(function(error) {
    next(error);
  });
};

// GET /course/allcourses
exports.show = function(req, res) {
  var action = req.session.action || null;
  var editedCourse = req.session.course || null;
  var errors = req.session.errors || {};
  req.session.errors = {};

  req.session.action = null;
  req.session.course = null;

  models.Course.findAll().then(function(courses) {
    req.session.where = 'all_courses';
    res.render('course/allcourses.ejs', {
      course: courses,
      action: action,
      editedCourse: editedCourse,
      errors: errors
    });
  }).catch(function(error) {
    req.session.where = 'all_courses';
    res.render('course/allcourses.ejs', {
      course: {},
      action: "",
      editedCourse: "",
      errors: errors
    });
  });
};

// GET /course/new
exports.new = function(req, res) {
  var course = models.Course.build({
    name: "Nombre",
    description: "Descripcion",
    specialisation: "Especializacion",
    credits: "creditos",
    vacancies: "vacantes"
  });
  var newCourse = req.session.newCourse || null;
  req.session.newCourse = null;
  req.session.where = 'all_courses';
  res.render('course/new', {
    course: course,
    newCourse: newCourse
  });
};

// POST /course/create
exports.create = function(req, res) {
  var course = models.Course.build(req.body.course);

  course.validate().then(function(err) {
    if (err) {
      req.session.where = 'all_courses';
      res.render('course/new', {
        course: course,
        errors: err.errors
      });
    }
    else {
      //course.save({fields: ["name", "description", "specialisation", "credits", "vacancies"]})
      course.save().then(function(newCourse) {
        req.session.newCourse = req.body.course;
        //save log
        models.Logs.create({
          userID: req.session.user.id,
          controller: "Course",
          action: "Create",
          details: "courseID=" + newCourse.id + ";name=" + newCourse.name
        });
        req.session.msg = [{message: "Asignatura creada correctamente."}];
        res.redirect('/course/new');
      });
    } // res.redirect: Redirecci�n HTTP a lista de preguntas
  }).catch(function(error) {
    req.session.errors = error;
    res.redirect('/course/allcourses');
  });
};


// GET /course/:id/edit
exports.edit = function(req, res) {
  req.session.where = 'all_courses';
  res.render('course/edit', {
    course: req.course,
    errors: []
  });
};

// PUT /course/:id
exports.update = function(req, res) {
  // Es necesario ponerlas uno a uno porque son modificaciones
  req.course.name = req.body.course.name;
  req.course.description = req.body.course.description;
  req.course.specialisation = req.body.course.specialisation;
  req.course.credits = req.body.course.credits;
  req.course.vacancies = req.body.course.vacancies;
  req.course.year = req.body.course.year;
  req.course.semester = req.body.course.semester;

  req.course.validate().then(function(err) {
    if (err) {
      req.session.where = 'all_courses';
      res.render('course/edit', {
        course: req.course,
        errors: err.errors
      });
    }
    else {
      req.course.save({
        fields: ["name", "description", "specialisation", "credits", "vacancies", "year", "semester"]
      }).then(function() {
        req.session.action = "editado";
        req.session.course = req.course.name;
        res.redirect('/course/allcourses');
      });
      //save log
      models.Logs.create({
        userID: req.session.user.id,
        controller: "Course",
        action: "Edit",
        details: "courseID=" + req.course.id +
          ";name=" + req.course.name +
          ";description=" + req.course.description +
          ";specialisation=" + req.course.specialisation +
          ";credits=" + req.course.credits +
          ";vacancies=" + req.course.vacancies +
          ";year=" + req.course.year +
          ";semester=" + req.course.semester
      });
    }
  });
};

// DELETE /course/:id
exports.destroy = function(req, res) {
  req.course.destroy().then(function() {
    req.session.action = "borrado";
    req.session.course = req.course.name;
    //save log
    models.Logs.create({
      userID: req.session.user.id,
      controller: "Course",
      action: "Delete",
      details: "courseID=" + req.course.id + ";name=" + req.course.name
    });

    res.redirect('/course/allcourses');
  }).catch(function(error) {
    req.session.errors = error;
    res.redirect('/course/allcourses');
  });
};
