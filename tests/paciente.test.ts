import { describe, it, before, after } from "node:test";
import assert from "node:assert"
import { PacienteService } from "../src/services/paciente.service.js"
import { Validators } from "../src/utils/validators.js";

describe('PacienteSerrvice', () => {
    let pacienteService: PacienteService;

    before(() => {
        pacienteService = new PacienteService();
    })

    it('Deve cadastrar um paciente válido', () => {
        const resultado = pacienteService.cadastrarPaciente({
            nome: "Teste Silva",
            idade: 30,
            cpf: "529.876.543-21",
            telefone: "(11) 98765-4321",
            email: "teste@email.com",
            sintomas: ["febre", "tosse"],
            prioridade: "pouco-urgente"
        });

        assert.ok('id' in resultado);
        assert.strictEqual(resultado.nome, "Teste Silva");
    });

    it('Deve rejeitar paciente com CPF inválido', () => {
        const resultado = pacienteService.cadastrarPaciente({
            nome: "Teste",
            idade: 25,
            cpf: "123.456.789-00",
            telefone: "(11) 98765-4321",
            email: "teste@email.com",
            sintomas: ["febre"],
            prioridade: "nao-urgente"
        });

        assert.ok('erro' in resultado);
    });

    it('Deve validar CPF corretamente', () => {
        assert.strictEqual(Validators.validarCPF("529.876.543-21"), true);
        assert.strictEqual(Validators.validarCPF("111.111.111-11"), false);
        assert.strictEqual(Validators.validarCPF("123.456.789-00"), false);
    });

    it('Deve validar telefone', () => {
        assert.strictEqual(Validators.validarTelefone("(11) 98765-4321"), true);
        assert.strictEqual(Validators.validarTelefone("11987654321"), false);
    });

    it('Deve validar email', () => {
        assert.strictEqual(Validators.validarEmail("teste@email.com"), true);
        assert.strictEqual(Validators.validarEmail("email_invalido"), false);
    });

    
})