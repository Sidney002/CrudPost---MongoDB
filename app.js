const express = require('express')
const bodyparser = require('body-parser')
const nunjucks = require('nunjucks')
const port = 8081
const app = express()
const path = require('path')
const flash =  require("connect-flash")
const mongo = require('./mongoDB')
const { RedisClient } = require('redis')
const redis = require('./redisDB')
const pg = require('./postgress')

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
    //rota para renderizar a tela de cadastro
    app.get('/cadastrar', (req,res)=>{
        res.render('cadastrar')
    })
    //rota para tela de login
    app.get('/logar', (req,res)=>{
        res.render('logar')
    })


    //rota para renderizar a tela de postagem
    app.get('/postar', (req,res)=>{
        res.render('postar',)
    })
    //cadastrar usuarios no postgress
    app.post('/cadastrar', (req,res)=>{
        const newUser = "INSERT INTO cruduser (nome,email,senha,nascimento) VALUES ($1, $2, $3, $4)"
        pg.query(newUser,[req.body.name, req.body.email, req.body.senha, req.body.nascimento])
        res.redirect('/')
    })

    app.post('/postar',(req,res)=>{
        
        const resposta = ""
        const checar = (email)=>{
            pg.query("select email from cruduser where email = $1"[email],((err,results,fields)=>{
                resposta =  results.rows
                return resposta
                console.log(resposta)
            }))
        }
        if(checar(req.body.email) != null){
            const newPost = {
                autor: req.body.email,
                titulo: req.body.titulo,
                conteudo: req.body.conteudo,
                data: mongo.setData()
            }
            mongo.addPost(newPost)
            res.redirect('/timeLine')
        }            
    })

    //rota para renderizar pagina com lista dos posts
    app.get('/timeLine',async (req,res)=>{
        
        const dataPost = await mongo.getPost()
        res.render('timeLine',{itens:dataPost})
        
    })
    //apagar mensagem
    app.get('/delete/:titulo',async (req,res)=>{
        const id = await req.params.titulo
        await mongo.dellPost(id)
        console.log(id)
        res.redirect('/timeLine')
    })
    //salvar rascunho
    app.post('/postar/:email',(req,res)=>{
        Redis.set(req.body.email, req.body.conteudo)
    })



app.listen(port,()=>{
    console.log("Aplicação esta rodando na porta " + port)
})