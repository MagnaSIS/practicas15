var express = require('express');
var router = express.Router();

var sessionController = require('../controllers/sessionController');

/* Página de entrada GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', errors: [] });
});


//Definicion de rutas de sesion
router.get('/login', sessionController.new); // formulario login, muestra la pagina
router.post('/login', sessionController.create); //hacer login
router.get('/logout', sessionController.destroy); //hacer logout




module.exports = router;
