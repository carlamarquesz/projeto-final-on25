const express = require('express');
const router = express.Router();
const AbrigoController = require('../controller/abrigosController');

const modelAbrigos = require("../models/abrigos.json");
const abrigosController = new AbrigoController(modelAbrigos);

router.get('/', abrigosController.getAbrigos.bind(abrigosController));
router.get('/:id', abrigosController.getAbrigoPorId.bind(abrigosController));
router.post('/:id/agendar', abrigosController.agendarHorario.bind(abrigosController));
router.delete('/:id/desmarcar', abrigosController.desmarcarHorario.bind(abrigosController));
router.put('/:id/horarios_disponiveis', abrigosController.setHorariosDisponiveis.bind(abrigosController));
router.put('/:id/necessidades', abrigosController.setNecessidades.bind(abrigosController));

module.exports = router;
