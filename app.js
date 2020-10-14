//Modulos
require('dotenv').config(); //Si hay un .env, accedera el acceso a las variables de entorno

const app = require('./server');
//require('./db-connect');

//Servidor escuchando peticiones
app.listen(app.get('port'), () => {
  console.log('Server on port ', app.get('port'));
});