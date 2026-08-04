export type Prioridade = 'emergencia' | 'muito-urgente' | 'urgente' | 'pouco-urgente' | 'nao-urgente';

export interface Paciente {
    id: string;
    nome: string;
    idade: number;
    cpf: string;
    telefone: string;
    email: string;
    sintomas: string[];
    dataChegada: Date;
    prioridade: Prioridade;
    atendido: boolean;
}

// Utility Types (RA02)
export type PacienteCadastro = Omit<Paciente, 'id' | 'dataChegada' | 'atendido'>;
export type PacienteAtualizacao = Partial<Omit<Paciente, 'id'>>;
export type PacienteResumo = Pick<Paciente, 'id' | 'nome' | 'prioridade' | 'dataChegada'>;

export interface EstatisticasAtendimento {
    totalPacientes: number;
    porPrioridade: Record<Prioridade, number>;
    tempoMedioEspera: number;
    pacientesAtendidos: number;
    pacientesEmEspera: number;
}

export type FilaAtendimento = Map<Prioridade, Paciente[]>;