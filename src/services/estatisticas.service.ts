import { Paciente, EstatisticasAtendimento, PacienteResumo, Prioridade } from "../models/types.ts";
import { PacienteService } from "./paciente.service.ts";

export class EstatisticasService {
    constructor (private pacienteService: PacienteService) {}

    gerarEstatisticas(): EstatisticasAtendimento {
        const pacientes = this.pacienteService.listarPacientes();

        const porPrioridade = pacientes.reduce((acc, paciente) => {
            acc[paciente.prioridade] = (acc[paciente.prioridade] || 0) + 1;
            return acc;
        }, {} as Record<Prioridade, number>);

        const pacientesAtendidos = pacientes.filter(p => p.atendido);
        const tempoMedioEspera = this.calcularTempoMedioEspera(pacientesAtendidos);

        return {
            totalPacientes: pacientes.length,
            porPrioridade,
            tempoMedioEspera,
            pacientesAtendidos: pacientesAtendidos.length,
            pacientesEmEspera: pacientes.filter(p => !p.atendido).length
        };
    }

    listarPorPrioridade(prioridade: Prioridade): PacienteResumo[] {
        return this.pacienteService
            .listarPacientes()
            .filter(p => p.prioridade === prioridade)
            .map(p => ({
                id: p.id,
                nome: p.nome,
                prioridade: p.prioridade,
                dataChegada: p.dataChegada
            }));
    }

    existemEmergencias(): boolean {
        return this.pacienteService
            .listarPacientes()
            .some(p => p.prioridade === 'emergencia' && !p.atendido);
    }

    obterDistribuicaoPorIdade(): { faixaEtaria: string; quantidade: number }[] {
        const pacientes = this.pacienteService.listarPacientes();

        const distribuicao = pacientes.reduce((acc, paciente) => {
            let faixaEtaria: string;

            if (paciente.idade < 12) faixaEtaria = '0-11';
            else if (paciente.idade < 18) faixaEtaria = '12-17';
            else if (paciente.idade < 40) faixaEtaria = '18-39';
            else if (paciente.idade < 60) faixaEtaria = '40-59';
            else faixaEtaria = '60+';

            acc[faixaEtaria] = (acc[faixaEtaria] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(distribuicao).map(([faixaEtaria, quantidade]) => ({
            faixaEtaria,
            quantidade
        }));
    }

    gerarRelatorio(): string {
        const stats = this.gerarEstatisticas();
        const linhas: string[] = [
            '=== RELATÓRIO DE ATENDIMENTO - UPA ===',
            `Data: ${new Date().toLocaleString()}`,
            '',
            '--- ESTATÍSTICAS GERAIS ---',
            `Total de pacientes: ${stats.totalPacientes}`,
            `Pacientes Atendidos: ${stats.pacientesAtendidos}`,
            `Pacients em Espera: ${stats.pacientesEmEspera}`,
            `Tempo Médio de Espera: ${stats.tempoMedioEspera}`,
            '',
            '--- DISTRIBUIÇÃO POR PRIORIDADE ---',
            ...Object.entries(stats.porPrioridade).map(([prioridade, qtd]) =>
                `${prioridade}: ${qtd} paciente(s)`
            ),
            '',
            '=== FIM DO RELATÓRIO ==='
        ];

        return linhas.join('\n');
    }

    private calcularTempoMedioEspera(pacientes: Paciente[]): number {
        if (pacientes.length === 0) return 0;

        const tempoTotal = pacientes.reduce((soma, paciente) => {
            const tempoEspera = Date.now() - paciente.dataChegada.getTime();
            return soma + tempoEspera;
        }, 0);

        return tempoTotal / pacientes.length / (1000 * 60);
    }

    buscarrPorSintoma(sintoma: string): Paciente[] | {erro: string} {
        let pacientes = this.pacienteService.listarPacientes().filter(p => sintoma in p.sintomas)
        if(!pacientes) return {erro: 'Não há pacientes com esse sintoma'};
        return pacientes;
    }
}