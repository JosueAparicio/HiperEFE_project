'use strict'

const {
    google
} = require('googleapis');
const {
    OAuth2
} = google.auth;
const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var user = 'hiperefe.contact@gmail.com';
var cliente_id = '367396264455-uorv0btft5fm4k919t5t1db8ris9qom8.apps.googleusercontent.com';
var privateKey = 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCf7jH5F3y4KoKn\n3YpOjgZUptNNKhfukGJFjR7D1XMdhGUmqf/NwpAhZ6ysCfvlBg+7d1bBOtJDauuu\nWi3Q/qbZou/OykSyKsF61eFAyajKe7zl3k1M5fE3huOCxBLi8ffYeFSadLedGdjz\n0RFyQuh9DH0Ozw4nLYbKjgP2VVPOFXBH87RlAlg/62U9UQAzNaFPdAm+gmTi5J7b\nPKog2iNxmn+KHCc/mnLg3d/UZdU8MMwUm9Q/mt7KuvnV4F6/upgioSXUjzSKFsci\np0lm9bZujnxVg9pIaNZXVt0UnbhDxwM0AedBnXVH1dcLJ0cCIGrGOQrM2HeFZExU\nqoJfllLjAgMBAAECggEAAOs05UnxwPsZig5XQ5FETwswTpKt1YSF1AF2Ckj5ItPG\nYvz6B7wU6OQ4FTrvdAbfY0PRv0VvvMxp8zP4bGlyGvD5MLZvw5hESUjeROmDqzof\nwTBQQF9Xzepb9z3aH+yk8Fzsm4CNJ31lBi2OzJm+zS0bsNCWs7nqutIrCqi91QK/\nMbYr+7TvAucgiFKqUws/TM1qsK0/52uMkb58n8TOxaSlUW9Lu3UpKesr8UiNsb0N\nCgpYe2sWts449yz2XfKygqXO0y5pV1Sj5GTifuG8mSiuq0Aj8nHeasnM5PvAqm+m\n+rHTPeEN5uKmmtUkmVl1DUI8Aox3T8u1HDp9e9laOQKBgQDLHEC83AeTNbHso6nZ\ngN3alQFz3H69kMBDp89tuXkdon4UFqm4QSaHP9D8gtTVnu3T3QjWRH4uTZkAhpVV\ns4aqpMMdTu7ET5i4aB8c4xdg7k7vBPEQ9K/MJS5SZDns8aL1suDjhh/wL95c0cbS\nnfAmL1/fokOGQxdy9bXchC+R2wKBgQDJk3trNWcSqkIDru/OKUjsbnxzJFmcqpEn\nqmEWJyuefZLBv90SWUxmpT3wRKZulkuevfEmQh5Mm8X/KJXM7uvhsq/Qxg+YLkQc\nTeRhta/FbFbJiSN7E0DIeWenDchTLpE94n6M8VhFj0L1TkliCbek/q+CWNWh3f64\nGNpTWlKlmQKBgBI+rHYKkcegeCYYoYY/NC6RWfsNYHkoyoyJQ3HIyl9mHEszqfU6\nLPrTObOlEPdLenOglE2jA26nW8oXTMzQ/pTPjhNQ5tPNjptqBvlyUMRNQ9vmprzu\nLeh5ooqWJDnrjsbhVaA6iR3rPt85nNGIjGzxrnwJOGWUG0QhXD+9xAQnAoGAfsbU\n/o5trx2Ju0tQ4zav+JNcjgY0ngXgmTPdL9Oe6WVM4bJL1fh3xq7yj6R9kFvSX5pS\nip9W8xOdqWbbIDK8BA0f6oxGzo16pNqQYqukSuRiiQpJWGS5f9xrRnOypC5LhsJm\nmTpJLCZ4FFQSbyhxacIMnExGwDEgvKRU28uY4zECgYBTb1nLpnsiqcj3nDrQ84EU\nR+0C1KdlUCAF1mmGbk7uNeRs+y2iinh5965FQiXwb01ZaLlz4cj3MJ4NsqdVaLlZ\nyi8mKP/JI5BMWXh8Gn6BJHei2135o4yCOGwzZMIPAtmmNw0vIVJMgNPCJC/U3Oep\ntoHFSpZZ5wdnEx1fAvHg5Q==';
var typeAuth = 'OAuth2';
var clientSecret = 'bZ0xJXOtTMI5Z_G5aitgvU_j';
var refreshToken = '1//04b6981HmurdrCgYIARAAGAQSNwF-L9IrPzQ4NCiqZ1eFtasBUvwy0LwL4Quf5OyI7sxJe1TXsKhh8GNwzIDcl709hM8uJd7Q0yA';
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';


var sightengine = require('sightengine')('115828723', 'PaXmNEGLkzAkTABXEK7B');


const oauth2Client = new OAuth2(
    cliente_id,
    clientSecret,
    OAUTH_PLAYGROUND
);

var controller = {

    sendWelcomeEmail: (req, res) => {
        oauth2Client.setCredentials({
            refresh_token: refreshToken,
        });

        const accessToken = oauth2Client.getAccessToken();

        console.log(req.params.email);
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: typeAuth,
                user: user,
                clientId: cliente_id,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });
        const mailOptions = {
            from: 'HIPER EFE',
            to: `${req.params.email}`,
            subject: 'Bienvenido ' + req.params.email,
            html: `  <img src="https://firebasestorage.googleapis.com/v0/b/virtual-city-eb37f.appspot.com/o/welcome-info.jpg?alt=media&token=5b3f445f-6552-4339-bda4-249e0351b46e" alt="WELCOME IMAGE">
                
            `
        };
        transporter.sendMail(mailOptions).then(
            resp => {
                return res.status(200).send({
                    status: 'success',
                    message: 'Email de bienvenida enviado a ' + req.params.email
                });
            }).catch(err => {
            console.log(err);
            return res.status(500).send({
                status: 'error',
                message: err
            });
        });

    },


    sendAyuda: (req, res) => {
        console.log(req.body);

        oauth2Client.setCredentials({
            refresh_token: refreshToken,
        });
        const accessToken = oauth2Client.getAccessToken();
        var contenido = '';
        if (req.body.pregunta){
            contenido = req.body.pregunta;
        } else if (req.body.denuncia) {
            contenido = req.body.denuncia;
        }
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: typeAuth,
                user: user,
                clientId: cliente_id,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });
        const mailOptions = {
            
            from: 'HIPER EFE',
            to: `hiperefe.ayuda@gmail.com`,
            subject: `${req.body.status}`,
            html: ` 
            <p>${req.body.email}: ${contenido}</p>
            <br>
            <img  style="max-width:500px; " src="https://image.freepik.com/vector-gratis/servicio-al-cliente-soporte-tecnico-ayuda-linea_1200-399.jpg" alt="IMAGE">

            `
        };
        transporter.sendMail(mailOptions).then(
            resp => {
                return res.status(200).send({
                    status: 'success',
                    message: 'se envio el email'
                });
            }).catch(err => {
            console.log(err);
            return res.status(500).send({
                status: 'error',
                message: err
            });
        });

    },

    sendReportedEmail: (req, res) => {
        oauth2Client.setCredentials({
            refresh_token: refreshToken,
        });

        const accessToken = oauth2Client.getAccessToken();

        console.log(req.params.email);
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: typeAuth,
                user: user,
                clientId: cliente_id,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });
        const mailOptions = {
            from: 'HIPER EFE',
            to: `${req.params.email}`,
            subject: 'ADVERTENCIA DE MAL COMPORTAMIENTO',
            text: "Hola, " + req.params.email + ". Parece que has compartido contenido inapropiado en uno de nuestros chats y has sido reportado. ",
            html: `  <img src="https://firebasestorage.googleapis.com/v0/b/virtual-city-eb37f.appspot.com/o/reported.jpg?alt=media&token=5fb34a9d-0a14-4869-9a53-843b83af4f5e" alt="REPORT IMAGE">
                
            `
        };
        transporter.sendMail(mailOptions).then(
            resp => {
                return res.status(200).send({
                    status: 'success',
                    message: 'Email de bienvenida enviado a ' + req.params.email
                });
            }).catch(err => {
            console.log(err);
            return res.status(500).send({
                status: 'error',
                message: err
            });
        });

    },
    async sendDeleteEmail(req, res) {
        try {
            oauth2Client.setCredentials({
                refresh_token: refreshToken,
            });

            const accessToken = oauth2Client.getAccessToken();

            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: typeAuth,
                    user: user,
                    clientId: cliente_id,
                    clientSecret: clientSecret,
                    refreshToken: refreshToken,
                    accessToken
                },
                tls: {
                    // do not fail on invalid certs
                    rejectUnauthorized: false
                }
            });

            transporter.use("compile", hbs({
                viewEngine: {
                    partialsDir: "./views/",
                    layoutsDir: "./views/layout",
                    extname: ".hbs"
                },
                extName: ".hbs",
                viewPath: "./views/"
            }));

            const mailOptions = {
                from: 'HIPER EFE',
                to: `${req.params.email}`,
                subject: 'Expulsion de una sala HIPEREFE',
                template: 'deleteStudent',
                context: {
                    teacher: req.params.teacher,
                    reason: req.params.reason,
                    nameRoom: req.params.nameRoom
                }

            };

            transporter.sendMail(mailOptions).then(
                resp => {
                    return res.status(200).send({
                        status: 'success',
                        message: 'Email de bienvenida enviado a ' + req.params.email
                    });
                }).catch(err => {
                console.log(err);
                return res.status(500).send({
                    status: 'error',
                    message: err
                });
            });

        } catch (error) {
            console.log(error);
        }
    },

    revImage: (req, res) => {

        console.log(req.body.image);

        sightengine.check(['nudity']).set_url(req.body.image).then(function (result) {
            // The API response (result)
            return res.status(200).send({
                status: 'success',
                message: result
            });
        }).catch(function (err) {
            // Handle error
            return res.status(500).send({
                status: 'error',
                message: err
            });
        });
    }
}

module.exports = controller;