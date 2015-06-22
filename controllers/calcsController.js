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

//Post /controllers/student
exports.recalculate = function(req,res) {
	
	//Añadir o eliminar asignatura req.body.add
	//ID del curso req.body.courseID
	//ID del alumno req.session.user.id

	models.StudentCourse.findALL({where: {CourseID:req.body.courseID}}).then(function(studentCourses){
		
	}
}