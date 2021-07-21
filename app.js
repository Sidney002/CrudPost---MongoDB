const express = require('express')
const bodyparser = require('body-parser')
const nunjucks = require('nunjucks')
const port = 8081
const app = express()
const path = require('path')
const flash =  require("connect-flash")
const db = require('./mongoDB')

//Configuração   
    //public
    app.use(express.static(path.join(__dirname,"public")))
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use(flash())
    //bodyparser
    app.use(bodyparser.urlencoded({extended: true}))
    app.use(bodyparser.json())
    //template engine nunjucks
    app.set('view engine','njk')

    nunjucks.configure('views', {
        express:app,
        autoescape: false,
        noCache: true
    })
//Rotas
//criando as rotas
    //rotas para renderizar index
    app.get("/", (req,res)=>{
        
        res.render('index')
    })
    // const collection =  JSON.parse(postagem.find())
    // console.log(collection)
    //rota para renderizar a tela de cadastro
    app.get('/postar', (req,res)=>{
        res.render('postar',)
    })
    app.post('/postar',(req,res)=>{
        
        const newPost = {
            autor: req.body.email,
            titulo: req.body.titulo,
            conteudo: req.body.conteudo
        }
        db.addPost(newPost)
        res.redirect('/timeLine')
    })

    //rota para renderizar pagina com lista dos posts
    app.get('/timeLine',(req,res)=>{
        
        const itens = [{
            autor : "variascoisas@hotmail.com",
            titulo : "varias coisas",
            conteudo : "varias coisas acontecem"
        },{
            autor : "poucascoisas@hotmail.com",
            titulo : "poucas coisas",
            conteudo : "poucas coisas acontecem"
        },{
            autor : "algumascoisas@hotmail.com",
            titulo : "algumas coisas",
            conteudo : "algumas coisas acontecem"
        },{
            autor : "umacoisa@hotmail.com",
            titulo : "uma coisa",
            conteudo : "uma coisa aconteceu"
        }]
        res.render('timeLine',{itens:itens})
        
    })



app.listen(port,()=>{
    console.log("Aplicação esta rodando na porta " + port)
})