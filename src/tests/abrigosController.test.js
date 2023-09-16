const supertest = require('supertest');
const api = supertest('http://localhost:3000');

describe('Testando endpoints da api SOS chuvas', () => {
    it('Deve retornar uma lista de abrigos com 5 informações relevantes para doações', async () => {
        const response = await api.get('/abrigos');
        expect(response.status).toBe(200);
        const abrigos = response.body;
        abrigos.forEach(abrigo => {
            expect(abrigo).toHaveProperty('equipamento_publico_disponivel');
            expect(abrigo).toHaveProperty('endereco');
            expect(abrigo).toHaveProperty('bairro');
            expect(abrigo).toHaveProperty('horarios_disponiveis');
            expect(abrigo).toHaveProperty('necessidades'); 
        });

    });
    it('Deve retornar o nome do primeiro abrigo', async () => {
        const response = await api.get('/abrigos/1');
        expect(response.status).toBe(200);
        const abrigo = response.body;
        expect(abrigo.equipamento_publico_disponivel).toBe('Escola Municipal Diná de Oliveira (ABRIGO)');
    });
    it('Deve retornar erro 404 ao buscar abrigo inexistente', async () => {
        const response = await api.get('/abrigos/1000');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Abrigo não encontrado');
    });
    it('Deve retornar erro 400 ao tentar agendar horário sem enviar dados obrigatórios', async () => {
        const response = await api.post('/abrigos/1/agendar');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Dados inválidos');
    });   
    it('Deve retornar erro 400 ao tentar agendar horário com horário não disponível', async () => {
        const response = await api.post('/abrigos/1/agendar').send({
            nome: 'Carla',
            data: '2023-09-15',
            horario: '07:00'
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Horário inválido');
    }); 
    it('Deve agendar horário com sucesso', async () => {
        const response = await api.post('/abrigos/1/agendar').send({
            nome: 'Carla',
            data: '2023-09-15',
            horario: '09:00'
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Horário agendado com sucesso');
    }); 
    it('Deve retornar erro 400 ao tentar desmarcar horário sem enviar dados obrigatórios', async () => {
        const response = await api.delete('/abrigos/1/desmarcar').send({
            data: '2023-09-15',
            horario: '08:00'
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Dados inválidos');
    });  
    it('Deve retornar erro 400 ao tentar desmarcar horário com horário não agendado', async () => {
        const response = await api.delete('/abrigos/1/desmarcar').send({
            nome: 'Carla',
            data: '2023-09-15',
            horario: '08:00'
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Horário não agendado');
    });
    it('Deve desmarcar horário com sucesso', async () => {
        const response = await api.delete('/abrigos/1/desmarcar').send({
            nome: 'Carla',
            data: '2023-09-15',
            horario: '09:00'
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Horário desmarcado com sucesso');
    });
    it('Alterar lista de horários disponíveis no abrigo', async () => {
        const response = await api.put('/abrigos/1/horarios_disponiveis').send({
            horarios_disponiveis: ['08:00', '09:00', '10:00']
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Horários disponíveis atualizados com sucesso');
    });
    it('Deve retornar erro 400 ao tentar alterar lista de horários disponíveis no abrigo com horários inválidos', async () => {
        const response = await api.put('/abrigos/10/horarios_disponiveis').send({
            horarios_disponiveis: ['03:00', '09:00', '10:00', '11:00']
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Horários inválidos');
    });
    it('Deve retornar erro 404 ao tentar alterar lista de horários disponíveis no abrigo inexistente', async () => {
        const response = await api.put('/abrigos/1000/horarios_disponiveis').send({
            horarios_disponiveis: ['08:00', '09:00', '10:00']
        });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Abrigo não encontrado');
    });
    it('Alterar lista de necessidades do abrigo', async () => {
        const response = await api.put('/abrigos/5/necessidades').send({
            necessidades: [
                {
                    "categoria": "Alimentos não perecíveis",
                    "prioridade": "Urgente"
                },
                {
                    "categoria": "Roupas",
                    "prioridade": "Urgente"
                },
                {
                    "categoria": "Água",
                    "prioridade": "Urgente"
                },
                {
                    "categoria": "Colchões",
                    "prioridade": "Pouco urgente"
                },
                {
                    "categoria": "Produtos de higiene pessoal",
                    "prioridade": "Moderado"
                },
                {
                    "categoria": "Produtos de limpeza",
                    "prioridade": "Moderado"
                },
                {
                    "categoria": "Remédios",
                    "prioridade": "Urgente"
                }
            ]
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Itens de necessidades atualizados com sucesso');
    });

});
