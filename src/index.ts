import { PacienteService } from "./services/paciente.service.ts";
import { TriagemService } from "./services/triagem.service.ts";
import { EstatisticasService } from "./services/estatisticas.service.ts";
import { ApiService } from "./api/api.service.ts";
import { Paciente, PacienteAtualizacao, PacienteCadastro, Prioridade } from "./models/types.ts";
import { Validators } from "./utils/validators.ts";
import * as readline from "node:readline";
import { resolve } from "node:path";

function askQuestion(query: string, rl: readline.Interface) {
    return new Promise(resolve => rl.question(query, ans => {
        resolve(ans);
    }))
}

var cpfDialogo = async function (paciente: any, rl: readline.Interface) {
    let cpfResponse = await askQuestion('informe o cpf do paciente (111.111.111-01): ', rl) as string;
    if(Validators.validarCPF(cpfResponse)) {
        paciente.cpf = cpfResponse;
        console.log("Cpf válido");
        resolve("heeeya");
        return 0;
    }
    else {
        console.log("CPF inválido informe o novamente!");
        await cpfDialogo(paciente, rl);
    }
    return;
}

var telefoneDialogo = async function (paciente: any, rl: readline.Interface) {
    let telResponse = await askQuestion('informe o o telefone do paciente ((11) 11111-1111): ', rl) as string;
    if(Validators.validarTelefone(telResponse)) {
        paciente.telefone = telResponse;
        return;
    }
    else {
        console.log("Telefone inválido informe o novamente!");
        await telefoneDialogo(paciente, rl);
    }
}

var emailDialogo = async function (paciente: any, rl: readline.Interface) {
    let emailResponse = await askQuestion('informe o email do paciente (paciente@email.com): ', rl) as string;
    if(Validators.validarEmail(emailResponse)) {
        paciente.email = emailResponse;
    }
    else {
        console.log("Email inválido! Informe o novamente!");
        await emailDialogo(paciente, rl);
    }
}

var atendidoDialogo = async function (paciente: any, rl: readline.Interface) {
    let atendidoResponse = await askQuestion('O paciente foi atendido? (Y/N): ', rl) as string;
    if(atendidoResponse.toLowerCase() === 'y' || atendidoResponse.toLowerCase() === 's') {
        paciente.atendido = true;
    }
    else if (atendidoResponse.toLowerCase() === 'n') {
        paciente.atendido = false;
    }
    else {
        console.log("Resposta inválida! Informe a novamente!");
        await atendidoDialogo(paciente, rl);
    }
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

    paciente.nome = await askQuestion('Informe o nome do paciente: ', rl) as string;

    const idade =  await askQuestion('informe a idade do paciente: ', rl);
    paciente.idade = Number(idade);

    await cpfDialogo(paciente, rl);

    await telefoneDialogo(paciente, rl);

    await emailDialogo(paciente, rl);

    const sintomas = await askQuestion('Informe os sintomas do paciente separado por virgulas (sintoma 1, sintoma 2): ', rl) as string;
    paciente.sintomas = sintomas.split(', ');

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

async function consultarPaciente(ps: PacienteService, rl: readline.Interface){
    let answer = await askQuestion('informe o id do paciente que deseja consultar', rl) as string;
    let response = ps.consultarPaciente(answer);
    if(response === undefined) console.log("Não há paciente com esse id");
    else console.log(response);
    return;
}

async function atualizarPaciente(ps: PacienteService, rl: readline.Interface){
    let paciente = {} as PacienteAtualizacao;
   
    let id = await askQuestion('informe o id do paciente que deseja alterar', rl) as string;
    let question: string = "\nQual dado deseja alterar nesse paciente?\n\n1. nome\n2. idade\n3.cpf\n4. telefone\n5. email\n6. sintomas\n7. Foi atendido? \n\n Informe um número de 1 à 7: ";
    let answer = await askQuestion(question, rl) as string;
    switch (answer) {
        case '1':
            let n = await askQuestion('Informe o nome alterado: ', rl) as string;
            paciente.nome = n;
            break;
        case '2':
            let i = await askQuestion('Informe a idade alterado: ', rl) as string;
            paciente.nome = i;
            break;
        case '3':
            await cpfDialogo(paciente, rl);
            break;
        case '4':
            await telefoneDialogo(paciente, rl);
            break;
        case '5':
            await emailDialogo(paciente, rl);
            break;
        case '6':
            const sintomas = await askQuestion('Informe os sintomas do paciente separado por virgulas (sintoma 1, sintoma 2): ', rl) as string;
            paciente.sintomas = sintomas.split(', ');
            break;
        case '7':
            await atendidoDialogo(paciente, rl);
            break;
        default:
            console.log("Opção inválida");
            await atualizarPaciente(ps, rl);
            break;
    }
    let response = ps.atualizarPaciente(id, paciente);
    if('erro' in response) console.log(response.erro);
    else console.log(response);
    return;
}

async function atualizarPrioridade(ts: TriagemService, rl: readline.Interface){
    let prioridade = {} as Prioridade;
   
    let id = await askQuestion('informe o id do paciente que deseja alterar a prioridade: ', rl) as string;
    // tava pensando em fazer um enum pra prioridade
    let question: string = "\nQual é a prioridade nova do paciente?\n\n1. emergência\n2. muito-urgente\n3. urgente\n4. pouco-urgente\n5. não-urgente\n\n Informe um número de 1 à 5: ";
    let answer = await askQuestion(question, rl) as string;
    switch (answer) {
        case '1':
            prioridade = "emergencia";
            break;
        case '2':
            prioridade = "muito-urgente";
            break;
        case '3':
            prioridade = "urgente";
            break;
        case '4':
            prioridade = "pouco-urgente";
            break;
        case '5':
            prioridade = "nao-urgente";
            break;
        default:
            console.log("Opção inválida");
            await atualizarPrioridade(ts, rl);
            break;
    }
    let response = ts.atualizarPrioridade(id, prioridade);
    if(!response) console.log("Erro ao alterar prioridade.");
    else console.log(response);
    return;
}

async function buscarPorSintoma(es: EstatisticasService, rl: readline.Interface) {
    let answer = await askQuestion('Digite o sintoma: ', rl) as string;
    console.log(es.buscarrPorSintoma(answer));
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

    var opcoes = async function () {
        console.log("\n1. Cadastrar pacientes",
            "\n2. Carregar pacientes externos",
            "\n3. Listar Pacientes",
            "\n4. Consultar Paciente",
            "\n5; Atualizar Paciente",
            "\n6. Obter Distribuição Por Idade",
            "\n7. Obter Próximo Paciente",
            "\n8. Atualizar Prioridade",
            "\n9. Obter Status Fila",
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
                await consultarPaciente(pacienteService, rl);
                opcoes();
                break;
            case '5':
                await atualizarPaciente(pacienteService, rl);
                atualizarFila(triagemService);
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
                await atualizarPrioridade(triagemService, rl);
                atualizarFila(triagemService);
                opcoes();
                break;
            case '9':
                triagemService.obterStatusFila().forEach(element => {
                    console.log("Há ", element.quantidade, " pacientes em stiuação ", element.prioridade);
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
            case '13':
                buscarPorSintoma(estatisticasService, rl);
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
}

main().catch(console.error);