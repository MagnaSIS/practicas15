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

// controllers/contact_controller.js

var mailer = require('../libs/mailer.js');

// POST /contact
exports.sendMail = function(req, res) {

  var name = req.body.name;
  var apellidos = req.body.lastname;
  var email = req.body.email;
  var text = req.body.text;

  var allowedEmail = /^(([a-zA-Z])+(\d{3})+\@ikasle.ehu.e(u)?s$)/;
  var allowedName = /^[a-zA-Z ñÑáéíóúÁÉÍÓÚ]+$/;
  var allowedLastName = /^[a-zA-Z ñÑáéíóúÁÉÍÓÚ]+$/;

  if (allowedEmail.test(email) && allowedName.test(name) && allowedLastName.test(apellidos)) {
    mailer.sendCommentMail(email, text);
    res.redirect('/contact');
  }
  else {
    if (!allowedEmail.test(email)) {
      req.session.errors = [{
        "message": 'El correo no es un correo de la UPV / EHU. Tiene que ser del tipo correo@ikasle.ehu.eus'
      }];
    }
    if (!allowedName.test(name)) {
      req.session.errors = [{
        "message": 'El nombre debe tener letras'
      }];
    }
    if (!allowedLastName.test(apellidos)) {
      req.session.errors = [{
        "message": 'El apellido debe tener letras'
      }];
    }
    req.session.where = '';
    res.render('contact', {
      errors: req.session.errors
    });
  }
};
