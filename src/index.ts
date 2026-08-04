import { PacienteService } from "./services/paciente.service";
import { TriagemService } from "./services/triagem.service";
import { EstatisticasService } from "./services/estatisticas.service";
import { ApiService } from "./api/api.service";

async function main() {
    console.log("=== Sistema de Triagem - UPA ===\n");

    const pacienteService = new PacienteService();
    const triagemService = new TriagemService(pacienteService);
    const estatisticasService = new EstatisticasService(pacienteService);

    console.log("1. Cadastro de pacientes")

    console.log("\n2. Carregando pacientes externos...");
    try {
        const pacientesExternos = await ApiService.carregarPacientesExternos();

        pacientesExternos.forEach(paciente => {
            const resultado = pacienteService.cadastrarPaciente(paciente);
            if ('erro' in resultado) {
                console.log("Erro ao cadastrar: ", resultado.erro);
            } else {
                console.log("Paciente externo cadastrado: ", resultado.nome);
            }
        });
    } catch (erro) {
        console.log("Erro ao cadastrar dados externos! ", erro);
    }

    console.log("\n3. Organizando fila de antedimento...");
    triagemService.organizarFila();

    const statusFila = triagemService.obterStatusFila();
    console.log("Status da fila: ", statusFila);

    console.log("\n4. Gerando estatísticas");
    const estatisticas = estatisticasService.gerarEstatisticas();
    console.log("Estatísticas: ", estatisticas);

    /*
    console.log("\n5. Buscando pacientes por sintoma...");
    const pacientesComFebre = estatisticasService.buscarPorSintoma('febre');
    
    não fiz esse método ainda
    */

    console.log("\n5. Gerando relatório final:");
    console.log(estatisticasService.gerarRelatorio());

    console.log('\n6. Enviando estatísticas para o servidor...');
    try {
        const resultado = await ApiService.enviarEstatisticas(estatisticas);
        console.log('Envio: ', resultado.sucesso ? 'Sucesso' : 'Falha');
    } catch (erro) {
        console.error('Erro no envio: ', erro);
    }
}

main().catch(console.error);