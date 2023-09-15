const abrigos = require("../models/abrigos.json")
const fs = require("fs")
 
const horarios = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']; 

//Retornar nome dos abrigos
const getNameAllAbrigos = (req, res) => {  
    const result = abrigos.map(abrigo => ({
        equipamento_publico_disponivel: abrigo.equipamento_publico_disponivel,
        endereco: abrigo.endereco
    }));
    
    res.status(200).json(result);
}; 

//Retornar abrigo por id
const getAbrigoById = (req, res) => {
    const { id } = req.params;

    const abrigo = abrigos.find(abrigo => abrigo.id == id);

    if (!abrigo) {
        return res.status(404).json({ message: "Abrigo não encontrado" });
    }

    res.status(200).json(abrigo);
}

//Agendar horario para doar itens ao abrigo
const agendarHorario = (req, res) => {
    const { id } = req.params;
    const { nome, data, horario } = req.body;

    const abrigo = abrigos.find(abrigo => abrigo.id == id);

    if (!abrigo) {
        return res.status(404).json({ message: "Abrigo não encontrado" });
    }

    if (!nome || !data || !horario) {
        return res.status(400).json({ message: "Dados inválidos" });
    }

    if (!horarios.includes(horario)) {
        return res.status(400).json({ message: "Horário inválido" });
    }
    if (abrigo.agendamentos.some(agendamento => agendamento.data === data && agendamento.horario === horario)) {
        return res.status(400).json({ message: "Horário indisponível" });
    }

    const agendamento = {
        nome,
        data,
        horario
    }

    abrigo.agendamentos.push(agendamento);

    fs.writeFile("./src/models/abrigos.json", JSON.stringify(abrigos), 'utf8', function (err) {
        if (err) {
            res.status(500).send({
                message: err
            })
        } else {
            console.log("Agendamento criado com sucesso!")
            res.status(201).json(abrigo);
        }
    })
}
 

//Cancelar horario marcado para doações no abrigo 
const desmarcarHorario = (req, res) => {
    const { id } = req.params;
    const { nome, data, horario } = req.body;

    const abrigo = abrigos.find(abrigo => abrigo.id == id);

    if (!abrigo) {
        return res.status(404).json({ message: "Abrigo não encontrado" });
    }

    if (!nome || !data || !horario) {
        return res.status(400).json({ message: "Dados inválidos" });
    }

    if (!horarios.includes(horario)) {
        return res.status(400).json({ message: "Horário inválido" });
    }

    const agendamento = abrigo.agendamentos.find(agendamento => agendamento.data === data && agendamento.horario === horario);

    if (!agendamento) {
        return res.status(400).json({ message: "Horário não encontrado" });
    }

    abrigo.agendamentos.splice(abrigo.agendamentos.indexOf(agendamento), 1);

    fs.writeFile("./src/models/abrigos.json", JSON.stringify(abrigos), 'utf8', function (err) {
        if (err) {
            res.status(500).send({
                message: err
            })
        } else {
            console.log("Agendamento cancelado com sucesso!")
            res.status(200).json(abrigo);
        }
    })
}


module.exports = {
    getNameAllAbrigos,
    getAbrigoById,
    agendarHorario, 
    desmarcarHorario
}