var express = require('express');
var router = express.Router();

/*
 * Controllers
 */
var managerController = require('../controllers/manage_controller');
var securityController = require('../controllers/security_controller');
var userController = require('../controllers/user_controller');

/*
 * Helpers
 */
router.param('userId', userController.checkUserId);


/*Main View*/
router.get('/', 								securityController.isAdmin, managerController.index);

/*Users administration*/
router.post('/createUser', 						securityController.isAdmin, userController.notExistUser, managerController.createUser);
router.get('/changelock/:userId',				securityController.isAdmin, managerController.changeLock);
//router.post('/changeUserRole/:userId(\\d+)',	securityController.isAdmin, managerController.changeUserRole);
router.post('/createStudent/:userId(\\d+)',		securityController.isAdmin, managerController.createStudentFromUser);
router.get('/editUser/:userId(\\d+)', 			securityController.isAdmin, managerController.editUser);
router.put('/editUser/:userId(\\d+)', 			securityController.isAdmin, managerController.updateUser);
router.delete('/deleteUser/:userId(\\d+)', 		securityController.isAdmin, managerController.deleteUser);


/*View logs*/
router.get('/viewAllLogs', 						securityController.isAdmin, managerController.viewLogs);




module.exports = router;