// libs/mailer.js

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'magnanode@gmail.com',
        pass: 'Magna1234.'
    }
});

exports.sendResetPasswordMail = function(receiver, link) {
    transporter.sendMail({
        from: 'magnanode@gmail.com',
        to: receiver,
        subject: 'placeForMe: Modificar Contraseña',
        html: "Hola,<br> Por favor presiona el enlace para modificar tu password.<br><a href=" +
            link + ">Presiona aquí para modificar el password</a>"
    });
};