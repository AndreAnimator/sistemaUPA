# Sistema de Triagem para UPA

Uma Unidade de Pronto Atendimento (UPA) realiza diariamente centenas de atendimentos. O processo de triagem precisa classificar pacientes conforme o grau de urgência, organizar a fila de atendimento, registrar alterações de prioridade e disponibilizar estatísticas para a equipe médica.

## R01 — Cadastro e gerenciamento de pacientes

O sistema permite o cadastro de pacientes (paciente.service.ts cadastrarPaciente()). Os pacientes contém informações como nome, idade, sintomas, data de chegada e prioridade de atendimento, feitas com variáveis primitivas (nome: string, idade: number, atendido: boolean como exemplos o tipo paciente em types.ts). Permite consultar (paciente.service.ts consultarPaciente()) e atualizar informações dos pacientes cadastrados (paciente.service.ts atualizarPaciente()). 	

### Módulo 1 — Fundamentos e Tipagem Básica:

O sistema faz uso de variáveis, tipos primitivos (string, number, boolean), inferência de tipos (como visto na linha 27 em pacente.service.ts), tipagem explícita (como visto na linha 5 de paciente.service.ts), operadores () e expressões().

## R02 — Organização das funcionalidades do sistema 	

O sistema foi estruturado utilizando funções reutilizáveis e módulos independentes, permitindo separar responsabilidades como cadastro, fila, estatísticas e validações (só observar os arquivos das services). 	

### Módulo 2 — Funções e Escopo:

Declaração de funções, parâmetros obrigatórios(função cadastrar em paciente.service.ts), opcionais e default, Arrow Functions (como nas funções dento de classificarPrioridade), escopo de variáveis (acho que tem).

### Módulo 6 — Modularização:

O sistema faz uso de importação e exportação (named mas não default).

## R03 — Classificação e gerenciamento da fila de atendimento 	

O sistema aplica regras de negócio para classificar pacientes e controlar a ordem de atendimento conforme a prioridade definida (triagem.service.ts). Utilizar estruturas de decisão e repetição para controlar o fluxo da aplicação. (for, forEach, if dentro de triagem.service.ts)  	

### Módulo 3 — Estruturas de Controle e Decisão:

Tem uso de if/else, mas não deswitch, tem de operador ternário (l52 paciente.service.ts) , for (triagem.service.ts l39), while, Truthiness (l30 estatisticas.service.ts) e Falsiness (l7 validators.ts).

## R04 — Consulta, busca e geração de estatísticas

O sistema disponibiliza operações de análise dos dados dos pacientes, como listar pacientes por prioridade, localizar pacientes específicos, verificar condições e gerar informações consolidadas (triagem.service.ts e estatisticas.service.ts). 	

### Módulo 4 — Manipulação Avançada de Arrays:

map() (l15 triagem.service.ts), filter() (estatisticas.service.ts l15), find() (paciente.service.ts l59), some() (estatisticas.service.ts l42), reduce() (estatisticas.service.ts l10) e join() (paciente.service.ts l11).

## R05 — Modelagem das entidades do sistema 	

O sistema deve representar corretamente as entidades do domínio utilizando estruturas de dados tipadas, garantindo maior segurança e organização do código. (types.ts)	

### Módulo 5 — Tipagem de Objetos e Estruturas de Dados:

Interfaces (Paciente EstatisticasAtendimento), Type Aliases (Prioridade), Union Types (varios retornos de funções fazem union types, como a de atualizarPaciente()), Arrays de Objetos (listarPacientes retorna um array de Pacientes), Destructuring (acho que não usei) e Spread Operator (l15 paciente.service.ts).

## R06 — Simulação de comunicação com uma API 	

O sistema implementa uma camada simulando o carregamento de dados externos, utilizando operações assíncronas e manipulação de informações no formato JSON. (api.service.ts)

### Módulo 6 — Modularização e Assincronismo:

Promises, tipagem de retornos e manipulação de JSON. (tudo em api.service.ts)

## R07 — Validação automatizada das funcionalidades 	

O sistema posssui testes automatizados para validar as principais regras de negócio, incluindo cadastro, classificação de prioridade, consultas e operações assíncronas. Os testes são implementados utilizando o Node.js Test Runner (node:test). (paciente.test.ts e triagem.test.ts)

## Competência transversal:

Testes automatizados, validação de regras de negócio, qualidade de código e uso consciente de IA como ferramenta de apoio ao desenvolvimento (pedi ajuda ao DEEPSEEK para me livrar da dor de decidir o que fazer primeiro e pedi para ele me oferecer uma organização básica do código para eu implementar por cima).

## RA01 — Validação de dados com Expressões Regulares 	

O estudante deve pesquisar e implementar validações utilizando Regex para garantir a qualidade dos dados de entrada do sistema (ex.: CPF, telefone, e-mail ou outros campos relevantes). (validators.ts)

Pesquisa e aprofundamento:

Expressões Regulares, validação de dados e consulta à documentação técnica.

## RA02 — Aperfeiçoamento da tipagem utilizando Utility Types 	
Foi aplicado pelo menos um recurso avançado de tipagem do TypeScript, como Partial (types.ts), Pick (types.ts), Omit (types.ts), Readonly (triagem.service.ts) ou Record (estatisticas.service.ts), justificando sua utilização no contexto do projeto.
Partial foi utilizado para 

Pesquisa e aprofundamento:

Recursos avançados de tipagem do TypeScript e boas práticas de modelagem de dados.

## RA03 — Aplicação de recurso avançado do ecossistema TypeScript 	

O estudante deve pesquisar e incorporar um recurso moderno ao projeto, como Pattern Matching utilizando ts-pattern ou outra biblioteca/técnica equivalente, justificando sua escolha e aplicação.

Fiz o uso de Pattern Matching para definir a urgência do estado do paciente conforme os sintomas exemplificados, porém não tem uso no sistema até o momento (faltou substituir o uso dentro do sistema).

Cada requisito deverá ser identificado e explicado no arquivo README.md, indicando como foi implementado e quais decisões técnicas foram adotadas.

# Como rodar

`npm i `
para instalar as dependências
`node run dev`
para rodar o sistema
`node run tests`
para realizar os testes do sistema

# Exemplos de uso

Enquanto eu não faço o CLI o sistema roda automaticamente.

## Um diário de desenvolvimento que não encaixa necessariamente nos requisitos:

Coloquei uma propriedade de readonly para as prioridades existentes em triagem.service.ts pois é usada duas vezes quanto percorrida a fila.
Coloquei os usuários dentro do json de pacientes pois a IA deixou vazia por algum motivo, logo estava sem uso. Pra isso, toda vez que era preciso criar um objeto do tipo Paciente eu precisei usar ... e usar type casting em prioridade.
A IA alucionou o método buscarPorSintoma. Eu mesmo vou ter que implementar.
Tive de incluir "DOM" em "lib" dentro das configurações do TypeScript para poder utilizar o console.log.
O typescript não tava conseguindo reconhecer a biblioteca de testes do node, aí mudei para o tsconfig que estava na aula bônus e tive que mudar type em package.json de commonjs para module. Removi "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true, de tsconfig.
Fiz uma gambiarra para rodar os testes com flags que não estão mais em uso hoje em dia pois se não ele não reconhecia .ts como uma extensão de arquivo.