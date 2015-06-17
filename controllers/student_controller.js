 /**  
  *   placeForMe -
  *   Copyright (C) 2015 by Magna SIS <magnasis@magnasis.com>
  *
  *   This program is free software: you can redistribute it and/or modify
  *   it under the terms of the GNU General Public License as published by
  *   the Free Software Foundation, either version 3 of the License, or
  *   (at your option) any later version.
  *
  *   This program is distributed in the hope that it will be useful,
  *   but WITHOUT ANY WARRANTY; without even the implied warranty of
  *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  *   GNU General Public License for more details.
  *
  *   You should have received a copy of the GNU General Public License
  *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */
  
   var models=require("../models/models.js");
   var util=require("../includes/utilities.js");

   var crypto = require('crypto');
   var algorithm = 'aes-256-ctr';
   var password;

     


//GET /controllers/student
exports.new = function(req, res) {
    res.render('student/studentRegistration');
    //res.write("Hola");
    };

exports.create = function(req,res) {
    var name = req.body.name;
    var apellidos = req.body.lastname;
    var email = req.body.email;
    password = req.body.password; 
    console.log(password);
    var user = models.User.build();//creacion del user
    var student=models.Student.build();//creacion del student
    password = util.encrypt(password);

    console.log(password);
    //asignacion de valores al user
    user.email=email;
    user.password=password;

    //asignacion de valores al student
    student.name=name;
    student.surname=apellidos;
    student.year=3;//falta que lo coja del ejs
    student.avgGrade=6.5;//idem
    student.credits=140;//idem

   // console.log(user.password); 
    //guardar en base de datos
    user.save();
    student.save().then(function(){
        res.redirect('/login');
        });

    };
