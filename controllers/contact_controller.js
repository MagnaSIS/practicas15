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

//Post /controllers/contact

var nodemailer = require('nodemailer');
exports.sendMail = function(req, res) {

  var name = req.body.name;
  var apellidos = req.body.lastname;
  var email = req.body.email;
  var text = req.body.text;

  var allowedEmail = /^(([a-zA-Z])+(\d{3})+\@ikasle.ehu.e(u)?s$)/;
  var allowedName = /^[a-zA-Z ñÑáéíóúÁÉÍÓÚ]+$/;
  var allowedLastName = /^[a-zA-Z ñÑáéíóúÁÉÍÓÚ]+$/;

  if (allowedEmail.test(email) && allowedName.test(name) && allowedLastName.test(apellidos)) {

        //Envio del correo
        var link = text;

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'magnanode@gmail.com',
            pass: 'Magna1234.'
          }
        });
        transporter.sendMail({
          from: email,
          to: 'magnanode@gmail.com',
          subject: 'El usuario ' +email + " te ha enviado un comentario",
          html: "Nombre: "+name+" con apellido: "+apellidos+" dice lo siguiente: <br>" +link + "<br> Gracias. "
        });

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
