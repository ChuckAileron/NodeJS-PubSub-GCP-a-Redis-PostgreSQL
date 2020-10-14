const db = require('../services/postgresService');
const { getData } = require('../services/redisService');
    
module.exports = {
    //Evento luego de llegado el mensaje al suscriptor
    subscriberEvent: async(key) => {
        try{
            //Obtiene producto desde redis
            let value = await getData(key);
            console.log(`Producto sku: ${key} encontrado en Redis`);

            const producto = await db.getProductoBySKU(key);

            //Revisa si el producto ya esta en base de datos. Si no esta, inserta el producto en la base de datos
            if (producto.length === 0){
                let values = [key, value];
                let query = await db.insertProducto(values);
                console.log('Producto insertado en la base de datos');
            }
            else { // Si existe, actualiza producto en base de datos
                let values = [key, value, key];
                let query = await db.updateProducto(values);
                console.log('Producto actualizado en base de datos');
            }
        } catch (err) {
            console.log(err);
        }
    }
}