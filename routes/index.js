var express = require('express');
var router = express.Router();

/*
 * Define Controllers
 */
var sessionController	=	require	('../controllers/session_controller');
var studentController	=	require	('../controllers/student_controller');
var managerController	=	require ('../controllers/manage_controller');
var courseController	=	require	('../controllers/course_controller');
var calcsController		=	require ('../controllers/course_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


/*
*	Session Controller
*/
//router.get('/login',		sessionController.new);
//router.post('/login',		sessionController.create);
//router.delete('/logout',	sessionController.loginRequired,	sessionController.destroy);

/*
*	Students Controller
*/
router.get('/students', studentController.new);
router.post('/students', studentController.create);
//router.delete('/students/:id',	sessionController.isStudent,	studentController.destroy);
//router.put('/students/:id',		sessionController.isStudent,	studentController.update);

/*
*	Manager Controller
*/
//router.get('/manager',			sessionController.isAdmin,	managerController.new);
//router.post('/manager',			sessionController.isAdmin,	managerController.create);
//router.delete('/manager/:id',	sessionController.isAdmin,	managerController.destroy);
//router.put('/manager/:id',		sessionController.isAdmin,	managerController.update);

/*
 * Admin Controller
 */
//router.get('/course',			sessionController.isManager,	courseController.new);
//router.post('/course',			sessionController.isManager,	courseController.create);
//router.delete('/course/:id',	sessionController.isManager,	courseController.destroy);
//router.put('/course/:id',		sessionController.isManager,	courseController.update);


/*
* Calcs controller
*/
//router.get('/calcs/:idstudent/:idcourse',	sessionController.loginRequired,	calcsController.new);
