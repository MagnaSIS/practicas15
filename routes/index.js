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
/*var calcsController		=	require ('../controllers/course_controller');*/

/* GET home page. */
router.get('/', function(req, res, next) {
    req.session.where = 'index';
    var mensaje = req.session.msg;
    req.session.msg = [];
    var errores = req.session.errors;
    req.session.errors = [];
    res.render('index', {
        title: 'placeForMe',
        errors: errores,
        msg: mensaje
    });
});

/* Autoloaders */
router.param('courseId', courseController.load); // autoload :courseId
router.param('userId', userController.checkUserId);
router.param('token', userController.checkToken);

/* GET terms */
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
router.post('/modifipass', studentController.mostrarOK);

router.get('/modifipass/:token/edit', studentController.editPassword);
router.put('/modifipass/:token', studentController.updatePassword);

router.get('/user/confirm', sessionController.anonRequired, userController.confirm);
router.post('/user/confirm', sessionController.anonRequired, userController.setPassword);
router.get('/user/resend', sessionController.anonRequired, userController.resend);

/*
 *	Students Controller
 */
router.get('/students', studentController.new);
router.post('/students', userController.notExistUser, studentController.create);
router.get('/students/edit', sessionController.loginRequired, sessionController.roleRequired("STUDENT"), studentController.edit);
router.put('/students/update', sessionController.loginRequired, sessionController.roleRequired("STUDENT"), studentController.update);
//router.get('/students/:studentId(\\d+)', 											studentController.edit);
router.get('/students/verify/:verificationToken', studentController.verify);
//router.delete('/students/:userId(\\d+)',	sessionController.roleRequired("STUDENT"),	studentController.destroy);
router.get('/students/courses', sessionController.loginRequired, sessionController.roleRequired("STUDENT"), studentController.courses);
router.post('/students/manageCourses', sessionController.loginRequired, sessionController.roleRequired("STUDENT"), studentController.manageCourses);
router.post('/students/courses/select', sessionController.loginRequired, sessionController.roleRequired("STUDENT"), studentController.select);
router.post('/students/courses/remove', sessionController.loginRequired, sessionController.roleRequired("STUDENT"), studentController.remove);


/*
 * User Controller
 */
router.get('/course/new', sessionController.loginRequired, sessionController.roleRequired("ADMIN", "MANAGER"), courseController.new);
router.post('/course/create', sessionController.loginRequired, sessionController.roleRequired("ADMIN", "MANAGER"), courseController.create);
router.get('/course/allcourses', sessionController.loginRequired, sessionController.roleRequired("ADMIN", "MANAGER"), courseController.show);
router.get('/course/:courseId(\\d+)/edit', sessionController.loginRequired, sessionController.roleRequired("ADMIN", "MANAGER"), courseController.edit);
router.put('/course/:courseId(\\d+)', sessionController.loginRequired, sessionController.roleRequired("ADMIN", "MANAGER"), courseController.update);
router.delete('/course/:courseId(\\d+)', sessionController.loginRequired, sessionController.roleRequired("ADMIN", "MANAGER"), courseController.destroy);


module.exports = router;

/*
* Calcs controller

router.get('/calcs/:idstudent/:idcourse',	sessionController.loginRequired,	calcsController.new);
*/

/*GET contact */
router.get('/contactStudent', sessionController.loginRequired, sessionController.roleRequired("STUDENT"), studentController.contactStudent);
router.get('/contact', studentController.contact);

/*
 *  Contact Controller
 */
 router.post('/contactStudent', sessionController.loginRequired, sessionController.roleRequired("STUDENT"), contactController.sendMailStudent);
 router.post('/contact', contactController.sendMail);
