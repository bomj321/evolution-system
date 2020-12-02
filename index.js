'use strict'

let mongoose = require('mongoose');
let app = require('./app');
let port = process.env.PORT || 3999

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
var db = 'mongodb://localhost:27017/api_rest_evolution';
mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Conexión a la base de datos ha sido establecida satisfactoriamente...");

        // Creacion del servidor
        app.listen(port, () => {
            console.log(`Servidor corriendo correctamente en la url: localhost:${port}`);
        });

    })
    .catch(err => console.log(err));