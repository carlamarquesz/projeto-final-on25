const fs = require('fs');
const horarios = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

class AbrigoController {
    constructor(abrigos) {
        this.abrigos = abrigos;
    }

    sendResponse(res, status, data) {
        res.status(status).json(data);
    }

    getAbrigos(req, res) {
        const result = this.abrigos.map(abrigo => ({
            equipamento_publico_disponivel: abrigo.equipamento_publico_disponivel,
            endereco: abrigo.endereco,
            bairro: abrigo.bairro,
            horarios_disponiveis: abrigo.horarios_disponiveis,
            necessidades: abrigo.necessidades

        }));

        this.sendResponse(res, 200, result);
    }

    getAbrigoPorId(req, res) {
        const { id } = req.params;
        const abrigo = this.abrigos.find(abrigo => abrigo.id == id);

        if (!abrigo) {
            return this.sendResponse(res, 404, { message: "Abrigo não encontrado" });
        }

        this.sendResponse(res, 200, abrigo);
    }

    agendarHorario(req, res) {
        const { id } = req.params;
        const { nome, data, horario } = req.body;
        const abrigo = this.abrigos.find(abrigo => abrigo.id == id);

        if (!abrigo) {
            return this.sendResponse(res, 404, { message: "Abrigo não encontrado" });
        }

        if (!nome || !data || !horario) {
            return this.sendResponse(res, 400, { message: "Dados inválidos" });
        }

        if (!horarios.includes(horario)) {
            return this.sendResponse(res, 400, { message: "Horário inválido" });
        }

        if (abrigo.agendamentos.some(agendamento => agendamento.data === data && agendamento.horario === horario)) {
            return this.sendResponse(res, 400, { message: "Horário indisponível" });
        }

        const agendamento = { nome, data, horario };
        abrigo.agendamentos.push(agendamento);

        fs.writeFile("./src/models/abrigos.json", JSON.stringify(this.abrigos), 'utf8', err => {
            if (err) {
                return this.sendResponse(res, 500);
            } else { 
                return this.sendResponse(res, 201, { message: "Horário agendado com sucesso" });
            }
        });
    }

    desmarcarHorario(req, res) {
        const { id } = req.params;
        const { nome, data, horario } = req.body;
        const abrigo = this.abrigos.find(abrigo => abrigo.id == id);

        if (!abrigo) {
            return this.sendResponse(res, 404, { message: "Abrigo não encontrado" });
        }

        if (!nome || !data || !horario) {
            return this.sendResponse(res, 400, { message: "Dados inválidos" });
        }

        if (!horarios.includes(horario)) {
            return this.sendResponse(res, 400, { message: "Horário inválido" });
        }

        const agendamento = abrigo.agendamentos.find(agendamento => agendamento.data === data && agendamento.horario === horario);

        if (!agendamento) {
            return this.sendResponse(res, 400, { message: "Horário não agendado" });
        }

        abrigo.agendamentos.splice(abrigo.agendamentos.indexOf(agendamento), 1);

        fs.writeFile("./src/models/abrigos.json", JSON.stringify(this.abrigos), 'utf8', err => {
            if (err) {
                return this.sendResponse(res, 500);
            } else { 
                return this.sendResponse(res, 201, { message: "Horário desmarcado com sucesso" });
            }
        });
    }
    setHorariosDisponiveis(req, res) {
        const { id } = req.params;
        const { horarios_disponiveis } = req.body;
        const abrigo = this.abrigos.find(abrigo => abrigo.id == id);
        console.log(abrigo)
    
        if (!abrigo) {
            return this.sendResponse(res, 404, { message: "Abrigo não encontrado" });
        } 
        if (!horarios_disponiveis.every(horario => horarios.includes(horario))) {
            return this.sendResponse(res, 400, { message: "Horários inválidos" });
        }
    
        abrigo.horarios_disponiveis = horarios_disponiveis;
    
        fs.writeFile("./src/models/abrigos.json", JSON.stringify(this.abrigos), 'utf8', err => {
            if (err) {
                return this.sendResponse(res, 500);
            } else { 
                return this.sendResponse(res, 201, { message: "Horários disponíveis atualizados com sucesso" });
            }
        });
    } 
    setNecessidades(req, res) {
        const { id } = req.params;
        const { 
            necessidades: [
                {
                    categoria,
                    prioridade
                }
            ]
        } = req.body;
        const abrigo = this.abrigos.find(abrigo => abrigo.id == id);
    
        if (!abrigo) {
            return this.sendResponse(res, 404, { message: "Abrigo não encontrado" });
        }
        if (!categoria || !prioridade) {
            return this.sendResponse(res, 400, { message: "Dados inválidos" });
        }
        abrigo.necessidades = {categoria, prioridade};
        fs.writeFile("./src/models/abrigos.json", JSON.stringify(this.abrigos), 'utf8', err => {

            if (err) {
                return this.sendResponse(res, 500);
            } else { 
                return this.sendResponse(res, 201, { message: "Itens de necessidades atualizados com sucesso" });
            }
        });  
    } 
}




module.exports = AbrigoController;
