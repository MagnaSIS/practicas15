var models = require('../models/models.js');


// Autoload :id
exports.load = function(req, res, next, courseId) {
  models.Course.findById(courseId).then(
    function(course) {
      if (course) {
        req.course = course;
        next();
      } else{next(new Error('No existe courseId=' + courseId))}
    }
  ).catch(function(error){next(error)});
};

// GET /course
exports.index = function(req, res) {
  models.Course.findAll().then(
    function(course) {
      res.render('course', { course: course, errors: []});
    }
  ).catch(function(error) { next(error);})
};

// GET /course/allcourses
exports.show = function(req, res) {
	var action = req.session.action || null;
	var editedCourse = req.session.course || null;
	req.session.action=null;
	req.session.course=null;
	
	models.Course.findAll().then(function(courses) {
      res.render('course/allcourses.ejs', { course: courses,action:action,editedCourse:editedCourse, errors: []});
    }
  ).catch(function(error) { next(error);})

};


// GET /course/new
exports.new = function(req, res) { 
	var course = models.Course.build({
			name: "Nombre", 
			escription: "Descripcion", 
			specialisation: "Especializacion", 
			credits: "creditos", 
			vacancies: "vacantes"}
  );
	var newCourse= req.session.newCourse || null;
	req.session.newCourse=null;
	res.render('course/new', {course: course,newCourse: newCourse, errors: []});
};

// POST /course/create
exports.create = function(req, res) {
	var course = models.Course.build( req.body.course );

	console.log(req.body.course["name"]);
	course.validate().then(function(err){
		if (err) {
			res.render('course/new', {course: course, errors: err.errors});
		} else {
			//course.save({fields: ["name", "description", "specialisation", "credits", "vacancies"]})
			course.save().then( function(){ 
				req.session.newCourse=req.body.course;
				res.redirect('/course/new')
			});
      }      // res.redirect: Redirecci�n HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});


};


// GET /course/:id/edit
exports.edit = function(req, res) {
  var course = req.course;  // req.course: autoload de instancia de course

  res.render('course/edit', {course: course, errors: []});
};

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
        req.course.save( {
        	fields: ["name", "description", "specialisation", "credits", "vacancies"]}).then( function(){ 
        		req.session.action="editado";
        		req.session.course=req.course.name;
        		res.redirect('/course/allcourses');
        	});
      }     // Redirecci�n HTTP a lista de preguntas (URL relativo)
    }
  );
};

// DELETE /course/:id
exports.destroy = function(req, res) {
	req.course.destroy().then( function() {
		req.session.action="borrado";
		req.session.course=req.course.name;
		res.redirect('/course/allcourses');
	}).catch(function(error){next(error)});
};
