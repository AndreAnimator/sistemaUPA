import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { PacienteService } from '../src/services/paciente.service.ts';
import { TriagemService } from '../src/services/triagem.service.ts';

describe('TriagemService', () => {
    let pacienteService: PacienteService;
    let triagemService: TriagemService;

    before(() => {
        pacienteService = new PacienteService();
        triagemService = new TriagemService(pacienteService);
    
        pacienteService.cadastrarPaciente({
            nome: "Emergência",
            idade: 50,
            cpf: "406.640.308-58",
            telefone: "(11) 99999-9999",
            email: "emergencia@teste.com",
            sintomas: ["parada cardíaca"],
            prioridade: "emergencia" 
        });

        pacienteService.cadastrarPaciente({
            nome: "Normal",
            idade: 25,
            cpf: "801.734.358-23",
            telefone: "(11) 98888-8888",
            email: "normal@teste.com",
            sintomas: ["tosse"],
            prioridade: "nao-urgente"
        });
    });

    it('Deve priorizar emergências na fila', () => {
        triagemService.organizarFila();
        const proximo = triagemService.obterProximoPaciente();

        assert.ok(proximo);
        assert.strictEqual(proximo.prioridade, 'emergencia');
    });

    it('Deve atualizar prioridade do paciente', () => {
        const paciente = pacienteService.listarPacientes();
        const pacienteNormal = paciente.find(p => p.nome === 'Normal');
    
        assert.ok(pacienteNormal);

        const atualizado = triagemService.atualizarPrioridade(
            pacienteNormal.id,
            'urgente'
        );

        assert.strictEqual(atualizado, true);
    });
});