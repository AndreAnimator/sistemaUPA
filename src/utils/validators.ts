export class Validators {
    static validarCPF(cpf: string): boolean{
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(cpf)) return false;

        const numeros = cpf.replace(/[^\d]/g, '');
        if (numeros.length !== 11) return false;

        if (/^(\d)\1{10}$/.test(numeros)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(numeros.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10) resto = 0;
        if (resto !== parseInt(numeros.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(numeros.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10) resto = 0;

        return resto === parseInt(numeros.charAt(10))
    }

    static validarTelefone(telefone: string): boolean {
        const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return telefoneRegex.test(telefone);
    }

    static validarEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    
    static validarSintomas(sintomas: string[]): boolean {
        return sintomas.length > 0 && sintomas.every(s => s.trim().length > 2);
    }

    static validarPaciente(paciente: any): { valido: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!paciente.nome || paciente.nome.trim().length < 3) {
            errors.push("Nome deve ter pelo menos 3 caracteres");
        }

        if (!this.validarCPF(paciente.cpf)) {
            errors.push('CPF inválido');
        }

        if (!this.validarTelefone(paciente.telefone)) {
            errors.push('Telefone inválido');
        }

        if (!this.validarEmail(paciente.email)) {
            errors.push('Email inválido');
        }

        if (!this.validarSintomas(paciente.sintomas)) {
            errors.push('Sintomas inválidos');
        }

        return {
            valido: errors.length === 0,
            errors
        };
    }
}