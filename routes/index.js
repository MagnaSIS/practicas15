var express = require('express');
var router = express.Router();
var util=require("../includes/utilities.js");

/*
 * Define Controllers
 */
var sessionController	=	require	('../controllers/session_controller');
var studentController	=	require	('../controllers/student_controller');
var managerController	=	require ('../controllers/manage_controller');
var courseController	=	require	('../controllers/course_controller');
/*var calcsController		=	require ('../controllers/course_controller');

*/
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PlaceForMe', errors: [] });
});

router.param('courseId', courseController.load);  // autoload :courseId

module.exports = router;


/*
*	Session Controller
*/
router.get('/login',	util.requiredSecureConection,	sessionController.new);
router.post('/login',	util.requiredSecureConection,	sessionController.create);
router.delete('/logout',util.requiredSecureConection,	sessionController.loginRequired,	sessionController.destroy);

/*
*	Students Controller
*/

router.get('/students',			util.requiredSecureConection,		studentController.new);
router.post('/students',		util.requiredSecureConection,		studentController.create);
/*router.delete('/students/:id',	sessionController.isStudent,	studentController.destroy);
router.put('/students/:id',		sessionController.isStudent,	studentController.update);

/*
*	Manager Controller
*/
router.get('/manager',			util.requiredSecureConection,			sessionController.isAdmin,	managerController.new);
router.post('/manager',			util.requiredSecureConection,			sessionController.isAdmin,	managerController.create);
//router.delete('/manager/:id',	sessionController.isAdmin,	managerController.destroy);
//router.put('/manager/:id',		sessionController.isAdmin,	managerController.update);

/*
 * Admin Controller
*/

router.get('/course',						util.requiredSecureConection,		sessionController.isCourseAdmin,	courseController.index);
router.get('/course/new',					util.requiredSecureConection,		sessionController.isCourseAdmin,	courseController.new);
router.post('/course/create',				util.requiredSecureConection,		sessionController.isCourseAdmin,	courseController.create);
router.get('/course/allcourses',			util.requiredSecureConection,		sessionController.isCourseAdmin,	courseController.show);
router.get('/course/:courseId(\\d+)/edit',	util.requiredSecureConection,		sessionController.isCourseAdmin,	courseController.edit);
router.put('/course/:courseId(\\d+)',		util.requiredSecureConection,		sessionController.isCourseAdmin,	courseController.update);
router.delete('/course/:courseId(\\d+)',	util.requiredSecureConection,		sessionController.isCourseAdmin,	courseController.destroy);
 

/*
* Calcs controller

router.get('/calcs/:idstudent/:idcourse',	sessionController.loginRequired,	calcsController.new);
*/

