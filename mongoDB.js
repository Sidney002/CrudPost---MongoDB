require('dotenv').config();
const { MongoClient } = require('mongodb');
//sintax = mongodb://bancourl/porta
const Client = new MongoClient('mongodb://localhost/27017}',
    {useUnifiedTopology: true});

//Funções do usuario
    //resgatar dados do usuario
    async function getUser(){
        try{
            await Client.connect().then(()=>{
                console.log("app conectado ao mongodb")
            }).catch((err)=>{
                console.log("não foi possivel conectar ao mongoDB: " +err)
            })
            //crudblog = meu mongodb database
            const database = Client.db('crudblog')
            //Usuarios = collection que guarda os usuarios no database crudblog
            const user = database.collection('Usuarios')

            const usr = await user.find().forEach(p => console.log(p))
        }finally{
            await Client.close()
        }
    }
    async function addUser(obj){
        
        try{
            await Client.connect().then(()=>{
                console.log("app conectado ao mongodb")
            }).catch((err)=>{
                console.log("não foi possivel conectar ao mongoDB: " +err)
            })
            //conectando a collection e database passados por parametros
            const user = Client.db('crudblog').collection('Usuarios')

            await user.insertOne(obj).then(console.log("O usuario foi inserido com sucesso")).catch((err)=>{
                console.log("não foi possivel inserir o usuario: " +err)
            })
        }finally{
            await Client.close()
        }
    }
    async function updateUser(){
        try{
            await Client.connect().then(()=>{
                console.log("app conectado ao mongodb")
            }).catch((err)=>{
                console.log("não foi possivel conectar ao mongoDB: " +err)
            })
            //conectando a collection e database passados por parametros
            const user = Client.db('crudblog').collection('Usuarios')

            const query = {data: 14.091999}
            const update = {$set: {data: 14091999}}
            await user.updateOne(query, update). then(console.log("Usuario atualizado")).catch((err)=>{
                console.log("erro a atualizar o usuario: " + err)
            })

        }finally{
            await Client.close()
        }
    }
    //função de deletar usuarios
    async function dellUser(filter){
        try{
            await Client.connect().then(()=>{console.log("app conectado ao mongodb")}).catch((err)=>{console.log("não foi possivel conectar ao mongoDB: " +err)})
            //conectando a collection e database passados por parametros
            const user = Client.db('crudblog').collection('Usuarios')

            const result = await user.deleteOne(filter).then(console.log('${result.deletecount} usuario removido')).catch((err)=>{
                console.log("não foi possivel remover o usuario: " + err)
            })
            

        }finally{
            Client.close()
        }

    }
    //  dellUser({nome: 'Caio Sidney Mendes de Oliveira'}).then(getUser())
//Funções das postagens
    //a função de pegar as postagens é igual a de usuarios só mudando o nome da collection... pq sim xD
    
    async function getPost(){
        try{
            await Client.connect().then(()=>{
                console.log("app conectado ao mongodb")
            }).catch((err)=>{
                console.log("não foi possivel conectar ao mongoDB: " +err)
            })

            const database = Client.db('crudblog')
            const user = database.collection('Postagens')
            //só pra testar o find

            await user.find().forEach((item)=>{
                let arr = []
                arr.push(item)
                return arr
            })
            return getPost()
        }finally{
            await Client.close()
        }
    }
    
    //a função de adicionar postagens tbm é praticamente igual, ainda pq sim xD
    async function addPost(obj){
        
        try{
            await Client.connect().then(()=>{
                console.log("app conectado ao mongodb")
            }).catch((err)=>{
                console.log("não foi possivel conectar ao mongoDB: " +err)
            })
            //conectando a collection e database passados por parametros
            const user = Client.db('crudblog').collection('Postagens')

            await user.insertOne(obj).then(console.log("mensagem postada com sucesso")).catch((err)=>{
                console.log("não foi possivel realizar a postagem: " +err)
            })
        }finally{
            await Client.close()
        }
    }
    //mesma coisa, função de deletar mensagem
    //o filtro que vai ser passado por parametro sera = titulo = titulo da mensagem
    async function dellPost(filter){
        try{
            await Client.connect().then(()=>{console.log("app conectado ao mongodb")}).catch((err)=>{console.log("não foi possivel conectar ao mongoDB: " +err)})
            //conectando a collection e database passados por parametros
            const user = Client.db('crudblog').collection('Usuarios')

            const result = await user.deleteOne(filter).then(console.log('${result.deletecount} usuario removido')).catch((err)=>{
                console.log("não foi possivel remover o usuario: " + err)
            })
            

        }finally{
            Client.close()
        }

    }
    // const mar = arr.map((i)=>{
    //     console.log(i)

    // })
module.exports = {
    Client,
    MongoClient,
    addPost,addUser,
    getPost,getUser,
    dellPost,dellUser,
    updateUser
}