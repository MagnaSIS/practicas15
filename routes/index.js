var express = require('express');
var router = express.Router();

/*
 * Define Controllers
 */
var sessionController = require('../controllers/session_controller');
var studentController = require('../controllers/student_controller');
var courseController = require('../controllers/course_controller');
var userController = require('../controllers/user_controller');
var contactController = require('../controllers/contact_controller');
/*var calcsController		=	require ('../controllers/course_controller');

*/
/* GET home page. */
router.get('/', function(req, res, next) {
    req.session.where = 'index';
    mensaje = req.session.msg;
    req.session.msg = {};
    res.render('index', {
        title: 'placeForMe',
        errors: [],
        msg: mensaje
    });
});

router.param('courseId', courseController.load); // autoload :courseId
router.param('userId', userController.checkUserId);
router.param('token', userController.checkToken);
router.param('emailId', studentController.loadEmail);


/*GET terms */
router.get('/terms', function(req, res, next) {
    req.session.where = '';
    res.render('terms');
});

/*
 *	Session Controller
 */
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.delete('/logout', sessionController.loginRequired, sessionController.destroy);

router.get('/modifipass', studentController.formPassword);
router.get('/modifipass/:emailId/okpass', studentController.mostrarOK);
router.get('/modifipass//okpass', function(req, res, next) {
    req.session.errors = [{
        "message": 'No has introducido ningun email'
    }];
    next();
}, studentController.formPassword);

router.get('/modifipass/:token/edit', studentController.editPassword);
router.put('/modifipass/:token', studentController.updatePassword);

router.get('/user/confirm', userController.confirm);
/*
 *	Students Controller
 */
router.get('/students', studentController.new);
router.post('/students', userController.notExistUser, studentController.create);
router.get('/students/edit', sessionController.loginRequired, sessionController.isStudent, studentController.edit);
router.put('/students/update', sessionController.loginRequired, sessionController.isStudent, studentController.update);
//router.get('/students/:studentId(\\d+)', 											studentController.edit);
router.get('/students/verify/:verificationToken', studentController.verify);
//router.delete('/students/:userId(\\d+)',	sessionController.isStudent,	studentController.destroy);
router.get('/students/courses', sessionController.loginRequired, sessionController.isStudent, studentController.courses);
router.post('/students/manageCourses', sessionController.loginRequired, sessionController.isStudent, studentController.manageCourses);


/*
 * Admin Controller
 */
router.get('/course/new', sessionController.loginRequired, sessionController.isCourseAdmin, courseController.new);
router.post('/course/create', sessionController.loginRequired, sessionController.isCourseAdmin, courseController.create);
router.get('/course/allcourses', sessionController.loginRequired, sessionController.isCourseAdmin, courseController.show);
router.get('/course/:courseId(\\d+)/edit', sessionController.loginRequired, sessionController.isCourseAdmin, courseController.edit);
router.put('/course/:courseId(\\d+)', sessionController.loginRequired, sessionController.isCourseAdmin, courseController.update);
router.delete('/course/:courseId(\\d+)', sessionController.loginRequired, sessionController.isCourseAdmin, courseController.destroy);


module.exports = router;

/*
* Calcs controller

router.get('/calcs/:idstudent/:idcourse',	sessionController.loginRequired,	calcsController.new);
*/

/*GET contact */
router.get('/contact', sessionController.loginRequired, sessionController.isStudent, studentController.contact);
/*
 *  Contact Controller
 */
 router.post('/contact', sessionController.loginRequired, sessionController.isStudent, contactController.sendMail);
