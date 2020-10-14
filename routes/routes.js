const { Router } = require('express');
const router = Router();

//Controladores para las rutas
const dbControllers = require('../controllers/db-controllers');
const redisControllers = require('../controllers/redis-controllers');
const pubsubControllers = require('../controllers/pubsub-controllers');

//Rutas PostgreSQL
router.get('/products', dbControllers.getProductos);
router.get('/product/:sku', dbControllers.getProductoBySKU);
router.get('/deleteProduct/:sku', dbControllers.deleteProducto);
router.post('/insert', dbControllers.insertProducto);
router.post('/updateProduct/:sku', dbControllers.updateProducto);

//Rutas Redis
router.post('/publisherEvent/', pubsubControllers.publisherEvent);

router.get('/getRedis/:sku', redisControllers.getProducto);
router.get('/deleteRedis/:sku', redisControllers.deleteProducto);
router.post('/insertRedis', redisControllers.setProducto);

module.exports = router;