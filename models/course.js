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

// models/course.js

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Course', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "-> Falta Nombre"
                }
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "-> Falta Descripcion"
                }
            }
        },
        specialisation: {
            type: DataTypes.ENUM,
            allowNull: true,
            values: ["IS", "IC", "C"],
        },
        credits: {
            type: DataTypes.INTEGER,
            allowNull: false,
			validate: {
				isInt: {
					msg: "-> El número de creditos debe ser número entero."
				}
			}
        },
        vacancies: {
            type: DataTypes.INTEGER,
            allowNull: false,
			validate: {
				isInt: {
					msg: "-> El número de plazas debe ser número entero"
				}
			}
        },MinimalGrade: {
        	type: DataTypes.FLOAT,
        	allowNull: false,
        	defaultValue:0.0,
        	validate: {
        		isFloat: {
        		  msg: "el grado minimo tiene que ser un float"
        		}
        	}
        } 
    });
}
