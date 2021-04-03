const express = require("express")
const server = express()
const routes = require("./routes");

// usando template engine
server.set('view engine', 'ejs')

//hablitando arquivos estáticos
server.use(express.static("public"))

// habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))

server.use(routes)

server.listen(3000, () => console.log('rodando') )