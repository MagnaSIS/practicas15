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


//Recalculate course minimal note
//req.body.redirect === REDIRECT URL!! (ASIGN BEFORE CALL recalculateMinNote!!)
exports.recalculateMinNote = function(req,res,course){
	
	models.StudentCourse.count({where: {CourseId:course.id}}).then(function(matriculados){
		var courseStudentsGrades=new Array();	
		models.StudentCourse.findAll(
			{	where: {CourseId:course.id},
				include: [{model: models.Student}]
			}).then(function(studentCourses){
				studentCourses.forEach(function(student){
					courseStudentsGrades.push(student.Student.avgGrade);
				});
				courseStudentsGrades.sort();
				
				if (matriculados>14){
					course.MinimalGrade=courseStudentsGrades[course.vacancies-1];
				}else{
					course.MinimalGrade=0;
				}			
				course.save().then(function(){
					res.redirect(req.body.redirect);
				}).catch(function(error){
					req.session.error="Error al guardar el curso= "+error;
					res.redirect(req.body.redirect);
				});	
			}).catch(function(error){
				req.session.error="Error al recalcular nota minima= "+error;
				res.redirect(req.body.redirect);
			});	
	}).catch(function(error){
		req.session.error="Error al contar numero de alumnos matriculados= "+error;
		res.redirect(req.body.redirect);
	});	
}
