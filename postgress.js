require('dotenv').config();
const {Client} = require('pg');
//conectar ao banco
const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD
});
//conectar cliente
client.connect()
    .then(()=>console.log("Cliente Conectado"))
    .catch(err => console.log("err.stack"))


//exportar cliente
module.exports = client;