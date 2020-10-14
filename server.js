//Modulos
const express = require('express');
const bodyParser = require('body-parser');
const { redisClient, redisSubscriber, subscriberEvent } = require('./services/redisService');
const { subscriptionPull } = require('./services/pubSubService')

//Inicializaciones
const app = express();

//Settings
app.set('port', process.env.PORT || 4000); //Definir puerto

//Middlewares
app.use(bodyParser.json()); // Parse application/json

//Conectar Redis
redisClient.on('error', function (err) {
    console.log('Error ' + err);
})

//Suscriptor GCP
subscriptionPull();

//Routes
app.use(require('./routes/routes'));

//Exportar metodos de express
module.exports = app;