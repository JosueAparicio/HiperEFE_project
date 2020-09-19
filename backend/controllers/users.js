'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var helpers = require('handlebars-helpers')();
const global = require('../services/Global')

var controller = {

    sendWelcomeEmail: (req, res) => {
        console.log(req.params.email);
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'hiperefe.contact@gmail.com',
                pass: 'hiperEFE2020'
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

    sendReportedEmail: (req, res) => {
        console.log(req.params.email);
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'hiperefe.contact@gmail.com',
                pass: 'hiperEFE2020'
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
            //console.log(req.params.email);
            /*const content = await global.compile('deleteStudent', {
                teacher: req.params.teacher,
                reason: req.params.reason
            })*/
            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                service: 'Gmail',
                auth: {
                    user: 'hiperefe.contact@gmail.com',
                    pass: 'hiperEFE2020'
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
    }
}

module.exports = controller;