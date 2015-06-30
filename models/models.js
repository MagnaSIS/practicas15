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

// models/models.js

var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var storage = process.env.DATABASE_STORAGE;

var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
//var storage = process.env.DATABASE_STORAGE;


// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, {
    dialect: dialect,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage, // solo SQLite (.env)
    omitNull: true
});

// Importar definiciones de tablas
var User = sequelize.import(path.join(__dirname, 'user'));
var Student = sequelize.import(path.join(__dirname, 'student'));
var Course = sequelize.import(path.join(__dirname, 'course'));
var StudentCourse = sequelize.import(path.join(__dirname, 'student_course'));
var Logs = sequelize.import(path.join(__dirname, 'logs'));

// Relaciones
Student.belongsTo(User, {
    onDelete: 'cascade'
});

Student.belongsToMany(Course, {
    through: StudentCourse
});
Course.belongsToMany(Student, {
    through: StudentCourse
});


StudentCourse.belongsTo(Student, {
    onDelete: 'cascade'
});
StudentCourse.belongsTo(Course, {
    onDelete: 'cascade'
});

exports.User = User;
exports.Student = Student;
exports.Course = Course;
exports.StudentCourse = StudentCourse;
exports.Logs = Logs;
exports.Sequelize = sequelize;

sequelize.sync().then(function() {
    User.count({
        where: {
            role: 'ADMIN'
        }
    }).then(function(count) {
        // Si no hay ningun admin, crea uno.
        if (count < 1) {
            User.create({
                email: 'admin@magnasis.com',
                password: require('../libs/utilities').encrypt('admin'),
                role: 'ADMIN',
                locked: false,
                isValidate: true,
            });
        }
    });
    console.log('Base de datos abierta');
});
