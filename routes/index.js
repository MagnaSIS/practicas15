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
router.param('userId', managerController.load);
router.param('Id',studentController.load);

module.exports = router;


/*
*	Session Controller
*/
router.get('/login',		sessionController.new);
router.post('/login',		sessionController.create);
router.delete('/logout',	sessionController.loginRequired,	sessionController.destroy);

/*
*	Students Controller
*/

router.get('/students',											studentController.new);
router.post('/students',	managerController.notExistStudents, studentController.create);
router.get('/verify/:Id(\\d+)',   studentController.verify);
//router.delete('/students/:userId(\\d+)',	sessionController.isStudent,	studentController.destroy);
//router.put('/students/:userId(\\d+)',	sessionController.isStudent,	studentController.update);

/*
*	Manager Controller
*/
router.get('/manager',						sessionController.isAdmin,										managerController.new);
router.post('/manager',						sessionController.isAdmin,	managerController.notExistManager,  managerController.create);
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
