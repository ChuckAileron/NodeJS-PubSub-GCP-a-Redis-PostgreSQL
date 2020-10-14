const { publish } = require('../services/pubSubService') 
const { setData } = require('../services/redisService');

module.exports = {
    publisherEvent: async (req, res) => {
        try{
            //Inserta nuevo dato a Redis
            await setData(req.body.sku, req.body.price);
            //Publica la key al topico
            await publish(req.body.sku);
            res.status(201).send(`Producto sku: ${req.body.sku}, price: ${req.body.price} insertado en Redis`);
        } catch (err) {
            console.log(err);
        }
    }
}