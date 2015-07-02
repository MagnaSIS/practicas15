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

exports.sendUserConfirmationMail = function(receiver, link) {
    transporter.sendMail({
            from: 'magnanode@gmail.com',
            to: receiver,
            subject: 'Registro del gestor en placeForMe',
            html: "Hola,<br>Un administrador de placeForMe te a elegido para que te registres como gestor de la plataforma.<br>Haz clic en este link para elegir una contraseña para tu usuario.<br><a href=" + link + ">Entrar</a>"
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