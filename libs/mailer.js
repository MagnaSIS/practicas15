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
        text: "Estimado usuario," +
            "\nHemos recibido una petición para recuperar la contraseña de la cuenta asociada a este correo." +
            "\nPor favor, vaya a este enlace " + link + " para restablecer su contraseña." +
            "\nEl equipo de placeForMe."
    });
};

exports.sendUserConfirmationMail = function(receiver, link) {
    transporter.sendMail({
            from: 'magnanode@gmail.com',
            to: receiver,
            subject: 'placeForme: Confirmación de cuenta',
            text: "Estimado usuario," +
            "\nHemos recibido una petición de registro" +
            "\nPor favor, vaya a este enlace " + link + " para activar su cuenta." +
            "\nEl equipo de placeForMe."
        });
};

exports.sendCommentMail = function(sender, text) {
    transporter.sendMail({
          from: sender,
          to: 'magnanode@gmail.com',
          subject: 'El usuario ' + sender + " te ha enviado un comentario",
          text: text
        });
}
