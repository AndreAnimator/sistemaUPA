import { Paciente, PacienteCadastro, PacienteAtualizacao, Prioridade } from "../models/types.ts";
import { Validators } from "../utils/validators.ts";

export class PacienteService {
    private pacientes: Paciente[] = [];

    cadastrarPaciente(dados: PacienteCadastro): Paciente | { erro: string } {
        const validacao = Validators.validarPaciente(dados);

        if (!validacao.valido) {
            return { erro: validacao.errors.join(', ')};
        }

        const novoPaciente: Paciente = {
            ...dados,
            id: this.gerarId(),
            dataChegada: new Date(),
            atendido: false,
            prioridade: this.classificarPrioridade(dados.sintomas, dados.idade) as Prioridade
        };

        this.pacientes.push(novoPaciente);
        return novoPaciente;
    }

    private classificarPrioridade(sintomas: string[], idade: number): string {
        const sintomasGraves = [
            'parada cardíaca', 'hemorragia', 'convulsão', 'infarto', 'dificuldade respiratória grave', 'perda de consciência'
        ];

        const sintomasModerados = [
            'dor intensa', 'fratura exposta', 'queimadura grave', 'febre alta', 'vômito persistente'
        ];

        const sintomasLeves = [
            'dor moderada', 'febre baixa', 'tosse', 'dor de cabeça', 'náusea', 'tontura'
        ];

        if (sintomas.some(s => sintomasGraves.includes(s.toLowerCase()))) {
            return 'emergencia';
        }

        if (idade > 60 && sintomas.some(s => sintomasModerados.includes(s.toLowerCase()))) {
            return 'muito-urgente';
        }

        if (sintomas.some(s => sintomasModerados.includes(s.toLowerCase()))) {
            return 'urgente';
        }

        if (sintomas.some(s => sintomasLeves.includes(s.toLowerCase()))) {
            return idade > 65 ? 'pouco-urgente' : 'nao-urgente';
        }

        return 'nao-urgente';
    }

    consultarPaciente(id: string): Paciente | undefined {
        return this.pacientes.find(p => p.id === id);
    }

    atualizarPaciente(id: string, dados: PacienteAtualizacao): Paciente | { erro: string } {
        const index = this.pacientes.findIndex(p => p.id === id);

        if (index === -1) {
            return { erro: 'Paciente não encontrado' };
        }

        this.pacientes[index] = {
            ...this.pacientes[index],
            ...dados
        };

        return this.pacientes[index];
    }

    listarPacientes(): Paciente[]{
        return [...this.pacientes];
    }

    private gerarId(): string {
        return `PAC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}