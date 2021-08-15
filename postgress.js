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

async function findUser(email) {
    const res = await client.query(`SELECT email FROM crudblog WHERE email=$1 LIMIT 1`,[email])
    

    if(res.rows.length > 0) {
        return res.rows[0]
    }else return null
}

async function getUser(email) {
    const res = await client.query(`SELECT * FROM crudblog WHERE email=$1`,[email])
    

    if(res.rows.length > 0) {
        return res.rows[0]
    }else return null
}

async function confirmUser(email) {
    const res =  await client.query(`SELECT senha FROM crudblog WHERE email=$1 LIMIT 1`,[email])

    if(res.rows.length > 0) {
        return res.rows[0]
    }else return null
}

async function cadastrarUser(nome,email, senha, nascimento){
    const newUser = "INSERT INTO crudblog (nome,email,senha,nascimento) VALUES ($1, $2, $3, $4)"
    client.query(newUser,[nome, email, senha, nascimento])
    console.log("usuario cadastrado com sucesso!")
}

//exportar cliente
module.exports = {
    client,
    findUser,
    confirmUser,
    cadastrarUser,
    getUser
}