'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
const nodemailer = require('nodemailer');

var controller = {

    sendWelcomeEmail: (req, res) => {
        console.log(req.params.email);
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 25,
            secure: false,
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
            subject: 'Bienvenido '+req.params.email,
            html: `  <img src="https://firebasestorage.googleapis.com/v0/b/virtual-city-eb37f.appspot.com/o/welcome-info.jpg?alt=media&token=5b3f445f-6552-4339-bda4-249e0351b46e" alt="WELCOME IMAGE">
                
            `
        };
        transporter.sendMail(mailOptions).then(
            resp => {
                return res.status(200).send({
                    status: 'success',
                    message: 'Email de bienvenida enviado a '+ req.params.email
                });
            }).catch(err => {
            console.log(err);
            return res.status(500).send({
                status: 'error',
                message: err
            });
        });

    }
}

module.exports = controller;