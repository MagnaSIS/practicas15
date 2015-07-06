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
        subject: 'placeForMe: Modificar contraseña',
        html: "Estimado usuario," +
            "<br/> Hemos recibido una petición para recuperar la contraseña de la cuenta asociada a este correo." +
            "<br/> Por favor, vaya a este <a href=" + link + ">enlace</a> para restablecer su contraseña." +
            "<br/> El equipo de placeForMe."
    });
};

exports.sendUserConfirmationMail = function(receiver, link) {
    transporter.sendMail({
            from: 'magnanode@gmail.com',
            to: receiver,
            subject: 'placeForme: Confirmación de cuenta',
            html: "Estimado usuario," +
            "<br/> Hemos recibido una petición de registro" +
            "<br/> Por favor, vaya a este <a href=" + link + ">enlace</a> para activar su cuenta." +
            "<br/> El equipo de placeForMe."
        });
};

exports.sendCommentMail = function(sender, text) {
    transporter.sendMail({
          from: sender,
          to: 'magnanode@gmail.com',
          subject: 'El usuario ' + sender + " te ha enviado un comentario",
          html: text
        });
}