import { Paciente, Prioridade } from "../models/types";
import { PacienteService } from "./paciente.service";

export class TriagemService {
    private filaAtendimento: Map<Prioridade, Paciente[]>;
    public readonly prioridades: Prioridade[] = [
        'emergencia',
        'muito-urgente',
        'urgente',
        'pouco-urgente',
        'nao-urgente'
    ];

    constructor (private pacienteService: PacienteService) {
        this.filaAtendimento = new Map();
        this.inicializarFila();
    }

    private inicializarFila(): void {
        this.prioridades.forEach(p => this.filaAtendimento.set(p, []));
    }

    organizarFila(): void {
        this.inicializarFila();
        const pacientes = this.pacienteService.listarPacientes();

        pacientes
            .filter(p => !p.atendido)
            .sort((a, b) => b.dataChegada.getTime() - a.dataChegada.getTime())
            .forEach(paciente => {
                const fila = this.filaAtendimento.get(paciente.prioridade);
                if (fila) {
                    fila.push(paciente);
                }
            });
    }

    obterProximoPaciente(): Paciente | null {
        for (const prioridade of this.prioridades) {
            const fila = this.filaAtendimento.get(prioridade);
            if (fila && fila.length > 0) {
                return fila.shift() || null;
            }
        }

        return null;
    }

    atualizarPrioridade(id: string, novaPrioridade: Prioridade): boolean {
        const paciente = this.pacienteService.consultarPaciente(id);

        if (!paciente) return false;

        const resultado = this.pacienteService.atualizarPaciente(id, {
            prioridade: novaPrioridade
        });

        if ('erro' in resultado) return false;

        this.organizarFila();
        return true;
    }

    obterStatusFila(): { prioridade: Prioridade; quantidade: number }[] {
        const status: { prioridade: Prioridade, quantidade: number }[] = [];

        this.filaAtendimento.forEach((fila, prioridade) => {
            status.push({
                prioridade,
                quantidade: fila.length
            });
        });

        return status;
    }
}