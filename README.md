# Gerenciador Financeiro

Sistema de controle de gastos residenciais, com cadastro de pessoas, cadastro de transações (receitas e despesas) e consulta de totais por pessoa e geral.

## Tecnologias utilizadas

- **Back-end:** .NET 8 / C#, ASP.NET Core Web API, Entity Framework Core, SQLite
- **Front-end:** React + TypeScript (Vite), Axios

## Funcionalidades

### Cadastro de pessoas
- Criar, listar e remover pessoas.
- Cada pessoa possui: `Id` (Guid, gerado automaticamente), `Nome` e `Idade`.
- Ao remover uma pessoa, todas as transações vinculadas a ela são removidas automaticamente (cascade), tanto no banco de dados quanto na regra de negócio do sistema.

### Cadastro de transações
- Criar e listar transações.
- Cada transação possui: `Id` (Guid, gerado automaticamente), `Descricao`, `Valor`, `Tipo` (`receita` ou `despesa`) e `PessoaId`.
- O `PessoaId` informado precisa corresponder a uma pessoa já cadastrada; caso contrário, a API retorna erro 400.
- **Regra de negócio:** pessoas menores de 18 anos só podem ter transações do tipo `despesa`. Uma tentativa de cadastrar `receita` para um menor de idade retorna erro 400 com mensagem explicativa.

### Consulta de totais
- Endpoint de relatório que retorna, para cada pessoa cadastrada, o total de receitas, o total de despesas e o saldo (receita − despesa).
- Ao final, retorna também o total geral de receitas, despesas e o saldo líquido de todas as pessoas somadas.

## Como rodar o projeto localmente

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download) ou superior
- [Node.js](https://nodejs.org/) (versão 18 ou superior) e npm
- Ferramenta de linha de comando do Entity Framework Core (necessária apenas se for recriar as migrações):
  ```
  dotnet tool install --global dotnet-ef
  ```

### 1. Clonar o repositório

```bash
git clone https://github.com/michaelcarlos1806-glitch/gerenciador-financeiro.git
cd gerenciador-financeiro
```

### 2. Rodar o back-end (API)

Em um terminal, a partir da raiz do projeto:

```bash
cd API
dotnet restore
dotnet ef database update
dotnet run
```

O comando `dotnet ef database update` cria o banco de dados SQLite (`banco.db`) com o schema atualizado, caso ele ainda não exista.

A API deve subir em:
```
http://localhost:5231
```

Você pode testar se está no ar acessando, por exemplo:
```
http://localhost:5231/api/transacao/relatorio
```
O retorno esperado (com o banco vazio) é:
```json
{"resumoPorPessoa":[],"totalGeralReceitas":0,"totalGeralDespesas":0,"saldoLiquidoGeral":0}
```

### 3. Rodar o front-end

Em **outro terminal** (mantendo a API rodando no primeiro), a partir da raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

O front-end deve subir em:
```
http://localhost:5173
```

Abra esse endereço no navegador. A tela permite:
- Cadastrar pessoas
- Visualizar e remover pessoas cadastradas
- Cadastrar transações vinculadas a uma pessoa
- Visualizar o resumo geral e por pessoa, atualizado automaticamente após cada cadastro

> **Importante:** tanto a API (porta 5231) quanto o front-end (porta 5173) precisam estar rodando ao mesmo tempo, em terminais separados, para o sistema funcionar por completo.

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/pessoa` | Cadastra uma nova pessoa |
| GET | `/api/pessoa` | Lista todas as pessoas |
| DELETE | `/api/pessoa/{id}` | Remove uma pessoa e suas transações (cascade) |
| POST | `/api/transacao` | Cadastra uma nova transação |
| GET | `/api/transacao` | Lista todas as transações |
| GET | `/api/transacao/relatorio` | Retorna o relatório de totais por pessoa e geral |

## Estrutura do projeto

```
gerenciador-financeiro/
├── API/                    # Back-end .NET
│   ├── Controllers/        # PessoaController e TransacaoController
│   ├── Data/                # AppDbContext (Entity Framework)
│   ├── models/              # Entidades Pessoa e Transacao
│   └── Migrations/          # Histórico de migrações do banco de dados
└── frontend/                # Front-end React + TypeScript
    └── src/
        ├── api.ts            # Funções de comunicação com a API (Axios)
        ├── types.ts          # Tipos TypeScript compartilhados
        └── App.tsx           # Componente principal (formulários e relatório)
```
