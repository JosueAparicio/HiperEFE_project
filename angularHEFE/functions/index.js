const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp()
require('dotenv').config()

const {SENDER_EMAIL, SENDER_PASSWORD} = process.env;

exports.sendEmailNotification = functions.firestore.document('users/{docId}')
.onCreate((snap,ctx) =>{
    const data = snap.data();

    let authData=nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: SENDER_EMAIL,
            pass:SENDER_PASSWORD
        }
    });

    authData.sendMail({
        from : 'hiperefe.contact@gmail.com',
        to: `${data.email}`,
        subject: 'Biemmvenido a HIPER EFE',
        Text: `${data.email}`,
        html: `${data.email}`
    }).then(resp=>console.log('email de bienvenida enviado exitosamente')).catch(err => console.log(err));
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
