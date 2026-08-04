Sistema de Triagem para UPA

Uma Unidade de Pronto Atendimento (UPA) realiza diariamente centenas de atendimentos. O processo de triagem precisa classificar pacientes conforme o grau de urgência, organizar a fila de atendimento, registrar alterações de prioridade e disponibilizar estatísticas para a equipe médica.

Sua tarefa será desenvolver um Sistema de Triagem e Gerenciamento de Atendimento utilizando exclusivamente TypeScript, sem interface gráfica obrigatória. O sistema poderá ser executado via terminal (Node.js), simulando a entrada de pacientes, classificação de risco, gerenciamento das filas e geração de relatórios.

Ao longo do desenvolvimento, você deverá aplicar os principais conceitos estudados na disciplina, organizando o código em módulos e implementando funcionalidades de forma incremental. Além disso, o projeto inclui desafios de pesquisa para incentivar a consulta à documentação oficial do TypeScript e a exploração de recursos modernos do ecossistema.
Requisitos do Projeto

Os requisitos abaixo descrevem as funcionalidades esperadas para o sistema, bem como as tecnologias, práticas e recursos técnicos que deverão ser aplicados durante o desenvolvimento.
Requisito 	Funcionalidade / Descrição 	Conteúdos Avaliados
R01 — Cadastro e gerenciamento de pacientes 	O sistema deve permitir cadastrar pacientes contendo informações como nome, idade, sintomas, data de chegada e prioridade de atendimento. Também deve permitir consultar e atualizar informações dos pacientes cadastrados. 	

Módulo 1 — Fundamentos e Tipagem Básica:

Variáveis, tipos primitivos (string, number, boolean), inferência de tipos, tipagem explícita, operadores e expressões.
R02 — Organização das funcionalidades do sistema 	O sistema deve ser estruturado utilizando funções reutilizáveis e módulos independentes, permitindo separar responsabilidades como cadastro, fila, estatísticas e validações. 	

Módulo 2 — Funções e Escopo:

Declaração de funções, parâmetros obrigatórios, opcionais e default, Arrow Functions, escopo de variáveis.

Módulo 6 — Modularização:

Importação e exportação (named e default).
R03 — Classificação e gerenciamento da fila de atendimento 	O sistema deve aplicar regras de negócio para classificar pacientes e controlar a ordem de atendimento conforme a prioridade definida. Deve utilizar estruturas de decisão e repetição para controlar o fluxo da aplicação. 	

Módulo 3 — Estruturas de Controle e Decisão:

if/else, switch, operador ternário, for, while, Truthiness e Falsiness.
R04 — Consulta, busca e geração de estatísticas 	O sistema deve disponibilizar operações de análise dos dados dos pacientes, como listar pacientes por prioridade, localizar pacientes específicos, verificar condições e gerar informações consolidadas. 	

Módulo 4 — Manipulação Avançada de Arrays:

map(), filter(), find(), some(), reduce() e join().
R05 — Modelagem das entidades do sistema 	O sistema deve representar corretamente as entidades do domínio utilizando estruturas de dados tipadas, garantindo maior segurança e organização do código. 	

Módulo 5 — Tipagem de Objetos e Estruturas de Dados:

Interfaces, Type Aliases, Union Types, Arrays de Objetos, Destructuring e Spread Operator.
R06 — Simulação de comunicação com uma API 	O sistema deve implementar uma camada simulando o carregamento de dados externos, utilizando operações assíncronas e manipulação de informações no formato JSON. 	

Módulo 6 — Modularização e Assincronismo:

Promises, tipagem de retornos e manipulação de JSON.
R07 — Validação automatizada das funcionalidades 	O sistema deve possuir testes automatizados para validar as principais regras de negócio, incluindo cadastro, classificação de prioridade, consultas e operações assíncronas. Os testes devem ser implementados utilizando o Node.js Test Runner (node:test). 	

Competência transversal:

Testes automatizados, validação de regras de negócio, qualidade de código e uso consciente de IA como ferramenta de apoio ao desenvolvimento.
RA01 — Validação de dados com Expressões Regulares 	O estudante deve pesquisar e implementar validações utilizando Regex para garantir a qualidade dos dados de entrada do sistema (ex.: CPF, telefone, e-mail ou outros campos relevantes). 	

Pesquisa e aprofundamento:

Expressões Regulares, validação de dados e consulta à documentação técnica.
RA02 — Aperfeiçoamento da tipagem utilizando Utility Types 	O estudante deve aplicar pelo menos um recurso avançado de tipagem do TypeScript, como Partial, Pick, Omit, Readonly ou Record, justificando sua utilização no contexto do projeto. 	

Pesquisa e aprofundamento:

Recursos avançados de tipagem do TypeScript e boas práticas de modelagem de dados.
RA03 — Aplicação de recurso avançado do ecossistema TypeScript 	O estudante deve pesquisar e incorporar um recurso moderno ao projeto, como Pattern Matching utilizando ts-pattern ou outra biblioteca/técnica equivalente, justificando sua escolha e aplicação. 	

Pesquisa e aprofundamento:

Ecossistema TypeScript, bibliotecas modernas, leitura de documentação e aprendizagem autônoma.

Os requisitos R01 a R07 representam as funcionalidades e práticas obrigatórias do projeto, consolidando os conteúdos trabalhados durante a disciplina.

Os requisitos RA01 a RA03 representam desafios de aprofundamento, nos quais o estudante deverá pesquisar, avaliar e aplicar novos conhecimentos relacionados ao ecossistema TypeScript.

Cada requisito deverá ser identificado e explicado no arquivo README.md, indicando como foi implementado e quais decisões técnicas foram adotadas.
Entrega

O aluno deverá entregar:

    link do repositório público GitHub;
    projeto completo;
    README.md detalhando como cada um dos 10 requisitos foi contemplado;
    instruções de execução;
    instruções para execução dos testes;
    exemplos de uso do sistema.


Além da IA: 

Coloquei uma propriedade de readonly para as prioridades existentes em triagem.service.ts pois é usada duas vezes quanto percorrida a fila.
Coloquei os usuários dentro do arry pacientes pois a IA deixou vazia por algum motivo, logo estava sem uso. Pra isso, toda vez que era preciso criar um objeto do tipo Paciente eu precisei usar ... e usar type casting em prioridade.
A IA alucionou o método buscarPorSintoma. EU mesmo tive de implementar.
Tive de incluir "DOM" em "lib" dentro das configurações do TypeScript para poder utilizar o console.log.