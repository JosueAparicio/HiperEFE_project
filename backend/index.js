'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

/*mongoose.connect('mongodb://localhost:27017/api_rest_master', {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('la conexion a la base de datos ha sido exitosa GGWP!!');

        //CREAR EL SERVUDOR Y ESCUCHAR PETICIONES HTTP
        app.listen(port, () => {
            console.log('Servidor corriendo en HTTP://localhost:' + port);
        });
    });*/

    
        //CREAR EL SERVUDOR Y ESCUCHAR PETICIONES HTTP
        app.listen(port, () => {
            console.log('Servidor corriendo en HTTP://localhost:' + port);
        });