var express = require('express');
var router = express.Router();

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


router.get('/students',					studentController.new);
router.post('/students',				studentController.create);
//router.delete('/students/:id',		sessionController.isStudent,	studentController.destroy);
//router.put('/students/:id',			sessionController.isStudent,	studentController.update);
router.get('/students/courses',			sessionController.isStudent,	studentController.courses);
router.post('/students/manageCourses',	sessionController.isStudent,	studentController.manageCourses);
/*
*	Manager Controller
*/
router.get('/manager',						sessionController.isAdmin,	managerController.new);
router.post('/manager',						sessionController.isAdmin,	managerController.create);
router.delete('/manager/:userId(\\d+)',		sessionController.isAdmin,	managerController.destroy);
router.put('/manager/:userId(\\d+)',		sessionController.isAdmin,	managerController.edit);

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

