const express = require("express");
const router = express.Router();
const controller = require("../controller/usuariosController");

router.post("/cadastrar", controller.createUser) 


module.exports = router;