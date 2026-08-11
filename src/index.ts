import { PacienteService } from "./services/paciente.service.ts";
import { TriagemService } from "./services/triagem.service.ts";
import { EstatisticasService } from "./services/estatisticas.service.ts";
import { ApiService } from "./api/api.service.ts";
import { Paciente, PacienteCadastro, Prioridade } from "./models/types.ts";
import { Validators } from "./utils/validators.ts";
import * as readline from "node:readline";
import { Readline } from "node:readline/promises";

/*
"\n1. Cadastrar pacientes",
"\n2. Carregar pacientes externos",
"\n3. Listar Pacientes",
"\n4. Consultar Paciente",
"\m5; Atualizar Paciente",
"\n6. Obter Distribuição Por Idade",
"\n7. obterProximoPaciente",
"\n8. atualizarPrioridade",
"\n9. obterStatusFila",
"\n10. Gerar Estatísticas",
"\n11. Gerar Relatório Final",
"\n12. Enviar Relatório para servidor",
"\n13. Fechar"
*/

function askQuestion(query: string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

async function cadastrarPaciente(rl: readline.Interface, ps: PacienteService){
    let paciente = {
        id: "",
        nome: "",
        idade: 0,
        cpf: "",
        telefone: "",
        email: "",
        sintomas: [""],
        prioridade: 'nao-urgente' as Prioridade,
        atendido: Boolean
    }

    paciente.nome = await askQuestion('Informe o nome do paciente: ') as string;

    rl.question('informe a idade do paciente', (answer) => {
        paciente.idade = Number(answer);
    });

    var cpfDialogo = function () {
        rl.question('informe o cpf do paciente (111.111.111-01)', (answer) => {
            if(Validators.validarCPF(answer)) {
                paciente.cpf = answer;
            }
            else {
                console.log("CPF inválido informe o novamente!");
                cpfDialogo();
            }
        });
    }
    
    var telefoneDialogo = function () {
        rl.question('informe o telefone do paciente ((11) 1 1111-1111)', (answer) => {
            if(Validators.validarTelefone(answer)) {
                paciente.telefone = answer;
            }
            else {
                console.log("Telefone inválido informe o novamente!");
                telefoneDialogo();
            }
        });
    }
    /*
    nome: string;
    idade: number;
    cpf: string;
    telefone: string;
    email: string;
    sintomas: string[];
    prioridade: Prioridade;
    */
    var emailDialogo = function () {
        rl.question('informe o email do paciente (paciente@email.com)', (answer) => {
            if(Validators.validarEmail(answer)) {
                paciente.email = answer;
            }
            else {
                console.log("Email inválido! Informe o novamente!");
                emailDialogo();
            }
        });
    }

    rl.question('Informe os sintomas do paciente separado por virgulas (sintoma 1, sintoma 2) ', (answer) => {
        const sintomas = answer.split(', ');
        paciente.sintomas = sintomas;
    });

    const p : PacienteCadastro = paciente;

    let response = ps.cadastrarPaciente(p);

    if('erro' in response) {
        console.log("Erro ao cadastrar");
    }
    else return;
}

async function cadastrarPacientesExternos(ps: PacienteService){
    try {
        const pacientesExternos = await ApiService.carregarPacientesExternos();

        pacientesExternos.forEach(paciente => {
            const resultado = ps.cadastrarPaciente(paciente);
            if ('erro' in resultado) {
                console.log("Erro ao cadastrar: ", resultado.erro);
            } else {
                console.log("Paciente externo cadastrado: ", resultado.nome);
            }
        });
    } catch (erro) {
        console.log("Erro ao cadastrar dados externos! ", erro);
    }
}

function atualizarFila(ts: TriagemService){
    console.log("\nOrganizando fila de antedimento...");
    ts.organizarFila();

    const statusFila = ts.obterStatusFila();
    console.log("Status da fila: ", statusFila);
}

function consultarPaciente(ps: PacienteService, rl: readline.Interface){
    rl.question('informe o id do paciente que deseja consultar', (answer) => {
        let response = ps.consultarPaciente(answer);
        if(response === undefined) console.log("Não há paciente com esse id");
        else console.log(response);
        rl.close();
    });
}

async function main() {
    console.log("=== Sistema de Triagem - UPA ===\n");

    const pacienteService = new PacienteService();
    const triagemService = new TriagemService(pacienteService);
    const estatisticasService = new EstatisticasService(pacienteService);

    let estatisticas: any;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    // código meio javascript mas é culpa do readline, e acontece tudo em realtime dps do ts ser transpilado para js ent tanto faz
    var opcoes = async function () {
        console.log("\n1. Cadastrar pacientes",
            "\n2. Carregar pacientes externos",
            "\n3. Listar Pacientes",
            "\n4. Consultar Paciente",
            "\n5; Atualizar Paciente",
            "\n6. Obter Distribuição Por Idade",
            "\n7. obterProximoPaciente",
            "\n8. atualizarPrioridade",
            "\n9. obterStatusFila",
            "\n10. Gerar Estatísticas",
            "\n11. Gerar Relatório Final",
            "\n12. Enviar Relatório para servidor",
            "\n13. Fechar"
        );

        rl.question('Escolha um número de 1 à 13. \n', async (answer) => {
            switch(answer.toLowerCase()) {
            case '13':
                return rl.close();
                break;
            case '1':
                await cadastrarPaciente(rl, pacienteService);
                atualizarFila(triagemService);
                opcoes();
                break;
            case '2':
                await cadastrarPacientesExternos(pacienteService);
                atualizarFila(triagemService);
                opcoes();
                break;
            case '3':
                if(estatisticasService.existemEmergencias()) console.log("Urgente!!! Há pacientes em situação de emergência!!!");
                console.log(pacienteService.listarPacientes());
                opcoes();
                break;
            case '4':
                consultarPaciente(pacienteService, rl);
                opcoes();
                break;
            case '5':
                // TODO atualizar os dados
                console.log("Finja que você pode atualizar os dados de um paciente");
                opcoes();
                break;
            case '6':
                estatisticasService.obterDistribuicaoPorIdade().forEach(element => {
                    console.log("Há ", element.quantidade, " pacientes na faixa etária entre ", element.faixaEtaria);
                });
                opcoes();
                break;
            case '7':
                let proximo = triagemService.obterProximoPaciente();
                if(proximo) console.log(`O próximo paciente é ${proximo.nome}`);
                else console.log("Não há um próximo paciente");
                opcoes();
                break;
            case '8':
                // TODO atualizarPrioridade fazer uma função para obter id de paciente e outra pra escolher prioridade
                console.log("Finja que tem como atualizar prioridade");
                opcoes();
                break;
            case '9':
                triagemService.obterStatusFila().forEach(element => {
                    console.log("Há ", element.quantidade, " pacientes em urgente ", element.prioridade);
                });
                opcoes();
                break;
            case '10':
                console.log("\nGerando estatísticas");
                estatisticas = estatisticasService.gerarEstatisticas();
                console.log("Estatísticas: ", estatisticas);
                opcoes();
                break;
            case '11':
                console.log("\nGerando relatório final:");
                console.log(estatisticasService.gerarRelatorio());
                opcoes();
                break;
            case '12':
                console.log('\n6. Enviando estatísticas para o servidor...');
                try {
                    const resultado = await ApiService.enviarEstatisticas(estatisticas);
                    console.log('Envio: ', resultado.sucesso ? 'Sucesso' : 'Falha');
                } catch (erro) {
                    console.error('Erro no envio: ', erro);
                }
                opcoes();
                break;
            default:
                console.log("\nOpção não identificada");
                opcoes();
                break;
            }
        });
    }

    opcoes();
    
    

    


    /*
    console.log("\n5. Buscando pacientes por sintoma...");
    const pacientesComFebre = estatisticasService.buscarPorSintoma('febre');
    
    não fiz esse método ainda
    */
}

main().catch(console.error);