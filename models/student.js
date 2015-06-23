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

// models/student.js

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Student', {
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Falta escribir el nombre"
                }
            }
        },
        surname: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Falta escribir el apellido"
                }
            }
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Falta definir el curso"
                },
                min: {args: [3], msg: "El año no puede ser menor que 3"},
                max: {args: [4], msg: "El año no puede ser mayor que 4"},
            },
        },
        avgGrade: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: {args: [0], msg: "La media no puede tener valor negativo"},
                max: {args: [10], msg: "La media no puede ser mayor que 10"},
                isFloat: {
                    msg: "La nota media tiene que ser un número"
                },
            }
        },
        credits: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {args: [0], msg: "El número de creditos no puede ser negativo"},
                max: {args: [240], msg: "El número de creditos no puede ser mayor que 240"},
                isInt: {
                    msg: "Los créditos tiene que ser un número"
                },
            },
        },
        specialisation: {
            type: DataTypes.ENUM,
            allowNull: true,
            values: ["IS", "IC", "C"],
        }
    });
}