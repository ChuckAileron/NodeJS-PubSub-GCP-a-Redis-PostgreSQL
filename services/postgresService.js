const { Pool } = require('pg');

//Configuracion de postgresql
const config = {
    user: process.env.DB_USER || 'postgresql',
    host: process.env.DB_HOST || 5432,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432
}

//Instancia del cliente
const pool = new Pool(config);

module.exports = {
    pool: pool,
    //Query: obtener todos los productos
    getProductos: async () => {
        try {
            let res = await pool.query('SELECT * FROM productos');
            return res.rows;
            //console.log(res.rows);
        } catch (err) {
            console.log(err.message);
        }
    },
    //Query: obtener producto segun sku
    getProductoBySKU: async (sku) => {
        try {
            //let value = `'${sku}'`;
            const text = `SELECT * FROM productos WHERE sku = '${sku}'`;
            let res = await pool.query(text);
            return res.rows;
        } catch (err) {
            console.log(err.message);
        }
    },
    //Query: insertar producto
    insertProducto: async (values) => {
        try {
            const text = 'INSERT INTO productos(sku, price) VALUES ($1, $2)';
            const res = await pool.query(text, values);
            console.log(res);
        } catch(err){
            console.log(err.message);
        }
    },
    //Query: actualizar producto
    updateProducto: async (values) => {
        try {
            const text = 'UPDATE productos SET sku = $1, price = $2 WHERE sku = $3';
            const res = await pool.query(text, values);
            console.log(res);
        } catch(err){
            console.log(err.message);
        }
    },
    //Query: eliminar producto
    deleteProducto: async (sku) => {
        try {
            const text = `DELETE FROM productos WHERE sku = '${sku}'`;
            const res = await pool.query(text);
            console.log(res);
        } catch(err){
            console.log(err.message);
        }
    }
}
