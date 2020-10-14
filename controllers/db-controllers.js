const db = require('./../services/postgresService');

module.exports = {
    getProductos: async (req, res) => {
        let query = await db.getProductos();
        console.log('Se han mostrado todos los productos');
        //console.log(query);
        res.status(200).send(query);
    },

    getProductoBySKU: async (req, res) => {
        console.log(req.params.sku);
        let query = await db.getProductoBySKU(req.params.sku);
        console.log('Se han mostrado todos los productos');
        res.status(200).send(query);
    },

    insertProducto: async (req, res) => {
        let values = [req.body.sku, req.body.price];
        let query = await db.insertProducto(values);
        console.log('Producto insertado en base de datos');
        res.status(201).send(query);
    },

    updateProducto: async (req, res) => {
        let values = [req.body.sku, req.body.price, req.params.sku];
        let query = await db.updateProducto(values);
        console.log('Producto actualizado en base de datos');
        res.status(200).send(query);
    },

    deleteProducto: async (req, res) => {
        let values = [req.params.sku];
        let query = await db.deleteProducto(values);
        console.log('Producto eliminado de la base de datos');
        res.status(200).send(query);
    },
};