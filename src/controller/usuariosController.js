const usuarios = require("../models/usuarios.json")
const fs = require("fs")

//Criar usuário
const createUser = (req, res) => {
    const {
        id,
        nome,
        email,
        senha
    } = req.body
    usuarios.push({
        id: (usuarios.length + 1),
        nome,
        email,
        senha
    })

    fs.writeFile("./src/models/usuarios.json", JSON.stringify(usuarios), 'utf8', function (err) {  
        if (err) {
            res.status(500).send({
                message: err
            })
        } else {
            console.log("Arquivo atualizado com sucesso!")
            const usuarioFound = usuarios.find(usuario => usuario.id == id) 
            res.status(200).send(usuarioFound)
        }
    })
}

module.exports = {
    createUser
}