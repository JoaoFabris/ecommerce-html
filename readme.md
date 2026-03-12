# Sistema de Gestão de Vendas

Pequenos comerciantes frequentemente enfrentam dificuldades para organizar seus pedidos, calcular valores com desconto corretamente, validar informações de clientes e manter um catálogo atualizado de produtos.

Esta aplicação foi desenvolvida como parte de um sistema de gestão de vendas, com foco na aplicação prática de JavaScript no front-end e Node.js no back-end.

---

## Objetivo

Desenvolver um sistema de vendas completo, incluindo:

- Catálogo de produtos com controle de estoque
- CRUD completo de produtos e pedidos
- Cálculo de descontos e frete por estado
- Consulta de endereço via API de CEP
- Criação e listagem de pedidos
- Persistência de dados em arquivos JSON
- Arquitetura MVC com Node.js + Express
- Programação Orientada a Objetos (POO)
- Operações assíncronas com Async/Await

---

## Estrutura do Projeto

```
atividade1/
├── app.js                      # Entry point — configura Express e rotas
├── frontend/
│   ├── index.html              # Estrutura da aplicação
│   ├── style.css               # Estilização da interface
│   ├── script.js               # Lógica do front-end
│   └── assets/                 # Imagens dos produtos
├── backend/
│   └── src/
│       ├── routes/             # Mapeamento de endpoints
│       │   ├── produtoRoutes.js
│       │   └── pedidoRoutes.js
│       ├── controllers/        # Recebe req/res e delega ao service
│       │   ├── produtoController.js
│       │   └── pedidoController.js
│       ├── services/           # Lógica de negócio
│       │   ├── produtoService.js
│       │   ├── pedidoService.js
│       │   └── cepService.js
│       ├── models/             # Classes e validações
│       │   ├── Produto.js
│       │   ├── Pedido.js
│       │   ├── PedidoComDesconto.js
│       │   └── Pessoa.js
│       ├── data/               # Persistência em JSON
│       │   ├── produtos.json
│       │   └── pedidos.json
│       ├── cli/
│       │   └── cli.js
│       └── tests/
│           └── testProduto.js
├── package.json
└── README.md
```

---

## Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado
- npm instalado

### Instalação

```bash
# Clone o repositório
git clone https://github.com/JoaoFabris/ecommerce-html.git

# Entre na pasta do projeto
cd atividade1

# Instale as dependências
npm install
```

### Iniciar o Servidor

```bash
node app.js
```

Acesse em: [http://localhost:3000](http://localhost:3000)

### Popular o Banco de Dados

```bash
node backend/src/tests/testProduto.js
```

### Executar via Terminal (CLI)

```bash
node backend/src/cli/cli.js
```

---

## Funcionalidades

### Front-End

- Exibição dinâmica do catálogo de produtos com imagens
- Seleção de produto e quantidade
- Cadastro de novos produtos pelo painel
- Edição de produtos diretamente no card
- Exclusão de produtos diretamente no card
- Calculadora de desconto por percentual
- Consulta de CEP via API externa
- Cálculo de frete por estado
- Resumo do pedido em tempo real
- Criação de pedidos
- Visualização de pedidos realizados
- Alteração de status do pedido
- Exclusão de pedidos

### Back-End (Node.js + Express)

- API REST com CRUD completo de produtos e pedidos
- Persistência de dados em arquivos JSON
- Controle automático de estoque ao realizar pedidos
- Validação de dados nas camadas model e service
- Arquitetura MVC (Routes → Controllers → Services → Models)

### CLI (Terminal)

```
1 - Cadastrar Produto
2 - Listar Produtos
3 - Calcular Média de Preços
4 - Criar Pedido
5 - Listar Pedidos
0 - Sair
```

---

## Endpoints da API

### Produtos

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/produtos` | Lista todos os produtos |
| `POST` | `/api/produtos` | Cadastra novo produto |
| `PUT` | `/api/produtos/:id` | Atualiza produto pelo ID |
| `DELETE` | `/api/produtos/:id` | Remove produto pelo ID |

### Pedidos

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/pedidos` | Lista todos os pedidos |
| `POST` | `/api/pedidos` | Cria novo pedido |
| `PUT` | `/api/pedidos/:id` | Atualiza status do pedido |
| `DELETE` | `/api/pedidos/:id` | Remove pedido pelo ID |

### CEP

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/cep/:cep` | Busca endereço pelo CEP via ViaCEP |

---

## Exemplos de Requisição / Resposta

### POST `/api/produtos`

**Requisição**
```json
{
  "nome": "Caderno",
  "preco": 29.90,
  "categoria": "Papelaria",
  "quantidade": 50,
  "img": "assets/caderno.png"
}
```

**Resposta 201**
```json
{
  "id": "uuid-gerado",
  "nome": "Caderno",
  "preco": 29.90,
  "categoria": "Papelaria",
  "quantidade": 50
}
```

### POST `/api/pedidos`

**Requisição**
```json
{
  "produto": { "id": "uuid-do-produto" },
  "quantidade": 2,
  "endereco": { "logradouro": "Rua X", "uf": "RJ" },
  "frete": 15.00
}
```

**Resposta 201**
```json
{
  "id": "uuid-gerado",
  "status": "pendente",
  "total": 74.80,
  "frete": 15.00,
  "dataCriacao": "2026-03-12T..."
}
```

### PUT `/api/pedidos/:id`

**Requisição**
```json
{ "status": "enviado" }
```

**Resposta 200**
```json
{ "id": "uuid", "status": "enviado", "total": 74.80, "..." : "..." }
```

---

## Programação Orientada a Objetos

| Classe | Descrição |
|--------|-----------|
| `Produto` | Modelo base com validação de dados e cálculo de desconto |
| `Pedido` | Criação de pedidos com validação de itens e cálculo de total |
| `PedidoComDesconto` | Herda de `Pedido` e sobrescreve `calculadoraTotal()` aplicando desconto — **polimorfismo** |
| `Pessoa` | Modelo de pessoa com validação de CPF, email e endereço |

### Polimorfismo

`PedidoComDesconto` estende `Pedido` e sobrescreve o método `calculadoraTotal()`:

```javascript
// Pedido — calcula total sem desconto
calculadoraTotal() {
  return this.produtos.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);
}

// PedidoComDesconto — mesmo método, comportamento diferente
calculadoraTotal() {
  const totalBruto = this.produtos.reduce(...);
  return totalBruto * (1 - this.percentualDesconto / 100);
}
```

---

## Operações Assíncronas

- `buscarCep(cep)` no `cepService.js` utiliza `async/await` para consultar a API [ViaCEP](https://viacep.com.br)
- Todas as chamadas do front-end ao back-end utilizam `fetch` com `async/await`

---

## Persistência de Dados

Os dados são armazenados localmente em:

- `backend/src/data/produtos.json`
- `backend/src/data/pedidos.json`

---

## Tecnologias Utilizadas

- HTML, CSS, JavaScript
- Node.js
- Express
- API ViaCEP
- Sistema de arquivos nativo (`fs`) do Node.js