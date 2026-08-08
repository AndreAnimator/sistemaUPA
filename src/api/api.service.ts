import { PacienteCadastro, Prioridade } from "../models/types.ts";
import Pacientes from "../data/pacientes.json" with { type: "json" }; 

export class ApiService {
    static async carregarPacientesExternos(): Promise<PacienteCadastro[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                setTimeout(() => {
                    const pacientesExternos: PacienteCadastro[] = [
                        {
                            ...Pacientes[0],
                            prioridade: Pacientes[0].prioridade as Prioridade
                        },
                        {
                            ...Pacientes[1],
                            prioridade: Pacientes[1].prioridade as Prioridade
                        }
                    ];
                    resolve(pacientesExternos);
                }, 2000);
            })
        })
    }

    static async enviarEstatisticas(dados: any): Promise<{ sucesso: boolean }> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const jsonDados = JSON.stringify(dados);
                    console.log("Dados enviados: ", jsonDados);
                    resolve({ sucesso: true });
                } catch (erro) {
                    reject(new Error("Erro ao enviar estatísticas!"));
                }
            }, 1000);
        });
    }
}