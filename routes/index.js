var express = require('express');
var router = express.Router();

/*
 * Define Controllers
 */
var sessionController	=	require	('../controllers/session_controller');
var studentController	=	require	('../controllers/student_controller');
var managerController	=	require ('../controllers/manage_controller');
var courseController	=	require	('../controllers/course_controller');
var userController 		= 	require ('../controllers/user_controller');
/*var calcsController		=	require ('../controllers/course_controller');

*/
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'placeForMe', errors: [] });
});

router.param('courseId', 	courseController.load);  // autoload :courseId
router.param('userId', 		userController.checkUserId);
router.param('emailId', 	studentController.loadEmail);

module.exports = router;


/*
*	User controller
*/
router.get('/user/changelock/:userId', 				sessionController.isAdmin,			userController.changeLock);

/*
*	Session Controller
*/
router.get('/login',		sessionController.new);
router.post('/login',		sessionController.create);
router.delete('/logout',	sessionController.loginRequired,	sessionController.destroy);

router.get('/modifipass',		studentController.formPassword);
router.get('/modifipass/:emailId/okpass',		studentController.mostrarOK);
router.get('/modifipass//okpass', function(req, res, next) {
	req.session.errors =[{"message": 'No has introducido ningun email'}];
	next();
}, studentController.formPassword);

router.get('/modifipass/:Id/edit',		studentController.editPassword);
router.put('/modifipass/:Id',		studentController.updatePassword);
/*
*	Students Controller
*/
router.get('/students',																studentController.new);
router.post('/students',						managerController.notExistStudents, studentController.create);
router.get('/students/edit', 					sessionController.isStudent,		studentController.edit);
router.put('/students/update',					sessionController.isStudent,		studentController.update);
//router.get('/students/:studentId(\\d+)', 											studentController.edit);
router.get('/students/verify/:Id',   												studentController.verify);
//router.delete('/students/:userId(\\d+)',	sessionController.isStudent,	studentController.destroy);
router.get('/students/courses',			sessionController.isStudent,	studentController.courses);
router.post('/students/manageCourses',	sessionController.isStudent,	studentController.manageCourses);

/*
*	Manager Controller
*/
router.get('/manager',						sessionController.isAdmin,										managerController.new);
router.post('/manager',						sessionController.isAdmin,	managerController.notExistManager,  managerController.create);
router.get('/manage/password/:token',																		managerController.password);
router.put('/manage/createpassword',																		managerController.putPassword);
router.delete('/manager/:userId(\\d+)',		sessionController.isAdmin,										managerController.destroy);
router.get('/manager/:userId(\\d+)/edit',	sessionController.isAdmin,										managerController.edit);
router.put('/manager/:userId(\\d+)',		sessionController.isAdmin,										managerController.update);

/*
 * Admin Controller
*/


router.get('/course',						sessionController.isCourseAdmin,	courseController.index);
router.get('/course/new',					sessionController.isCourseAdmin,	courseController.new);
router.post('/course/create',				sessionController.isCourseAdmin,	courseController.create);
router.get('/course/allcourses',			sessionController.isCourseAdmin,	courseController.show);
router.get('/course/:courseId(\\d+)/edit',	sessionController.isCourseAdmin,	courseController.edit);
router.put('/course/:courseId(\\d+)',		sessionController.isCourseAdmin,	courseController.update);
router.delete('/course/:courseId(\\d+)',	sessionController.isCourseAdmin,	courseController.destroy);


/*
* Calcs controller

router.get('/calcs/:idstudent/:idcourse',	sessionController.loginRequired,	calcsController.new);
*/
