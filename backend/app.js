'use strict'

//Cargar modulos de Node para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');


//Ejecutar Espress
var app = express();

//Cargar ficheros rutas
var users_rutes = require('./routes/users');


//Middlewares (es algo que se ejecuta antes de cargar alguna ruta)
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//CORS (permite peticiones desde el Frontend , sean estas ajax desde cualquier frontend (angular, react, vue, etc))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
}); // este middleware es sacado de la pagina victorroblesweb.es 'configurar el acceso CORS desde NodeJs '


//Añadir prefijos a rutas / cargar rtas
app.use('/', users_rutes);


//Exportar modulo (fichero actual)
module.exports = app;