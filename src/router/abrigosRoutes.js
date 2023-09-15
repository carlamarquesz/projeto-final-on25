const express = require('express');
const router = express.Router();
const controller = require('../controller/abrigosController');
router.get('/', controller.getNameAllAbrigos);
router.get('/:id', controller.getAbrigoById);
router.post('/:id/agendar', controller.agendarHorario); 
router.delete('/:id/desmarcar', controller.desmarcarHorario);
module.exports = router;