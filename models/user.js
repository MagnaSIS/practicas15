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

// models/user.js

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Falta escribir el correo electrónico"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Falta escribir el password"
                }
            }
        },
        role: {
            type: DataTypes.ENUM,
            values: ["ADMIN", "STUDENT", "MANAGER"],
            allowNull: false,
            defaultValue: "STUDENT",
            validate: {
                notEmpty: {
                    msg: "Falta definir el rol"
                },
            }
        },
        locked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isValidate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        confirmationToken: {
            type: DataTypes.STRING,
        },
        lang: {
            type: DataTypes.STRING,
            values: ["es", "eus"],
        },
    });
}
