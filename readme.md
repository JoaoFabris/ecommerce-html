# Sistema de Gestão de Vendas

Pequenos comerciantes frequentemente enfrentam dificuldades para organizar seus pedidos, calcular valores com desconto corretamente, validar informações de clientes e manter um catálogo atualizado de produtos.

Esta aplicação foi desenvolvida como parte de um sistema de gestão de vendas, evoluindo de um front-end simples até um marketplace completo com API REST, autenticação JWT, MongoDB e documentação Swagger.

---

## Objetivo

Desenvolver um sistema de vendas completo, incluindo:

- Catálogo de produtos com controle de estoque
- CRUD completo de produtos, pedidos, categorias, carrinho e usuários
- Autenticação e autorização com JWT + bcrypt
- Modelos persistidos no MongoDB via Mongoose
- Favoritos e endereço do usuário
- Cálculo de descontos e frete por estado
- Consulta de endereço via API de CEP
- Paginação e validações robustas com express-validator
- Documentação interativa com Swagger/OpenAPI 3.0
- Arquitetura MVC com Node.js + Express + camada de Services
- Programação Orientada a Objetos (POO)
- Operações assíncronas com Async/Await

---

## Estrutura do Projeto

```
atividade1/
├── server.js                        # Entry point — configura Express e rotas
├── .env                             # Variáveis de ambiente (não versionado)
├── .env.example                     # Modelo do .env
├── frontend/
│   ├── index.html                   # Estrutura da aplicação
│   ├── style.css                    # Estilização da interface
│   ├── script.js                    # Lógica do front-end
│   └── assets/                      # Imagens dos produtos
└── backend/
    └── src/
        ├── config/
        │   └── db.js                # Conexão MongoDB Atlas
        ├── middlewares/
        │   ├── auth.js              # Verifica JWT
        │   ├── isAdmin.js           # Verifica role admin
        │   ├── paginacao.js         # Paginação automática
        │   ├── validacoes.js        # Regras de validação
        │   └── validar.js           # Executa validações
        ├── routes/
        │   ├── userRoutes.js
        │   ├── categoriaRoutes.js
        │   ├── produtoRoutes.js
        │   ├── carrinhoRoutes.js
        │   └── pedidoRoutes.js
        ├── controllers/             # Recebe req/res e delega ao service
        │   ├── userController.js
        │   ├── categoriaController.js
        │   ├── produtoController.js
        │   ├── carrinhoController.js
        │   └── pedidoController.js
        ├── services/                # Lógica de negócio
        │   ├── userService.js
        │   ├── categoriaService.js
        │   ├── produtoService.js
        │   ├── carrinhoService.js
        │   ├── pedidoService.js
        │   └── cepService.js
        ├── models/                  # Mongoose Schemas + Classes JS
        │   ├── User.js
        │   ├── Categoria.js
        │   ├── Produto.js
        │   ├── Carrinho.js
        │   ├── Pedido.js
        │   ├── PedidoComDesconto.js
        │   └── Pessoa.js
        ├── docs/
        │   └── swagger.js           # Configuração Swagger/OpenAPI
        ├── utils/
        │   └── gerarToken.js        # Geração de JWT
        ├── data/
        │   ├── produtos.json
        │   └── pedidos.json
        ├── cli/
        │   └── cli.js
        └── tests/
            └── testProduto.js
```

---

## Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado
- Conta no MongoDB Atlas
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

### Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/gestao-vendas?retryWrites=true&w=majority
JWT_SECRET=sua_chave_secreta_aqui
```

### Iniciar o Servidor

```bash
# Produção
npm start

# Desenvolvimento (com nodemon)
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

Documentação Swagger: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Popular o Banco de Dados

```bash
node backend/src/tests/testProduto.js
```

### Executar via Terminal (CLI)

```bash
npm run cli
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

### Back-End (Node.js + Express + MongoDB)

- API REST com CRUD completo de usuários, categorias, produtos, carrinho e pedidos
- Autenticação com JWT e hash de senhas com bcrypt
- Autorização por roles (admin / user)
- Persistência no MongoDB via Mongoose
- Controle automático de estoque ao realizar pedidos
- Favoritos e endereço vinculados ao usuário
- Paginação automática nas listagens
- Validação de dados com express-validator
- Arquitetura MVC (Routes → Controllers → Services → Models)
- Documentação interativa em `/api-docs`

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

### Users

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/api/users/registrar` | — | Registrar novo usuário |
| `POST` | `/api/users/login` | — | Login e geração de token JWT |
| `GET` | `/api/users` | Admin | Listar todos os usuários |
| `PUT` | `/api/users/:id` | User | Atualizar nome e endereço |
| `DELETE` | `/api/users/:id` | Admin | Remover usuário |
| `GET` | `/api/users/favoritos` | User | Listar produtos favoritos |
| `POST` | `/api/users/favoritos/:produtoId` | User | Adicionar produto aos favoritos |
| `DELETE` | `/api/users/favoritos/:produtoId` | User | Remover produto dos favoritos |

### Categorias

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/categorias` | — | Listar todas as categorias |
| `GET` | `/api/categorias/:id` | — | Buscar categoria por ID |
| `POST` | `/api/categorias` | Admin | Criar categoria |
| `PUT` | `/api/categorias/:id` | Admin | Atualizar categoria |
| `DELETE` | `/api/categorias/:id` | Admin | Remover categoria |

### Produtos

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/produtos?page=1&limit=10` | — | Listar produtos paginado |
| `GET` | `/api/produtos/:id` | — | Buscar produto por ID |
| `POST` | `/api/produtos` | Admin | Criar produto |
| `PUT` | `/api/produtos/:id` | Admin | Atualizar produto |
| `DELETE` | `/api/produtos/:id` | Admin | Remover produto |

### Carrinho

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/carrinho` | User | Ver carrinho do usuário |
| `POST` | `/api/carrinho/adicionar` | User | Adicionar item ao carrinho |
| `DELETE` | `/api/carrinho/remover/:produtoId` | User | Remover item do carrinho |
| `DELETE` | `/api/carrinho/limpar` | User | Limpar carrinho |

### Pedidos

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/api/pedidos` | User | Criar pedido |
| `GET` | `/api/pedidos` | Admin | Listar todos os pedidos (paginado) |
| `GET` | `/api/pedidos/:id` | User | Buscar pedido por ID |
| `PUT` | `/api/pedidos/:id` | Admin | Atualizar status do pedido |
| `DELETE` | `/api/pedidos/:id` | Admin | Remover pedido |

### CEP

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/cep/:cep` | — | Busca endereço pelo CEP via ViaCEP |

---

## Exemplos de Requisição / Resposta

### POST `/api/users/registrar`

**Requisição**
```json
{
  "nome": "João Fabris",
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta 201**
```json
{
  "id": "uuid-gerado",
  "nome": "João Fabris",
  "email": "joao@email.com",
  "role": "user",
  "token": "eyJhbGci..."
}
```

### POST `/api/users/login`

**Requisição**
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta 200**
```json
{
  "id": "uuid-gerado",
  "nome": "João Fabris",
  "email": "joao@email.com",
  "role": "user",
  "token": "eyJhbGci..."
}
```

### POST `/api/produtos`

**Header:** `Authorization: Bearer <token_admin>`

**Requisição**
```json
{
  "nome": "Notebook",
  "preco": 3500,
  "categoria": "id-da-categoria",
  "quantidade": 10,
  "img": "assets/notebook.png"
}
```

**Resposta 201**
```json
{
  "_id": "uuid-gerado",
  "nome": "Notebook",
  "preco": 3500,
  "categoria": { "_id": "...", "nome": "Eletrônicos" },
  "quantidade": 10
}
```

### POST `/api/pedidos`

**Header:** `Authorization: Bearer <token>`

**Requisição**
```json
{
  "produto": { "id": "id-do-produto" },
  "quantidade": 1,
  "endereco": {
    "logradouro": "Rua Teste",
    "bairro": "Centro",
    "localidade": "Rio de Janeiro",
    "uf": "RJ",
    "cep": "20000-000"
  },
  "frete": 15
}
```

**Resposta 201**
```json
{
  "_id": "uuid-gerado",
  "status": "pendente",
  "total": 3515,
  "frete": 15,
  "createdAt": "2026-03-19T..."
}
```

### PUT `/api/pedidos/:id`

**Header:** `Authorization: Bearer <token_admin>`

**Requisição**
```json
{ "status": "enviado" }
```

**Resposta 200**
```json
{ "_id": "uuid", "status": "enviado", "total": 3515 }
```

---

## Autenticação

A API usa JWT. Após o login, inclua o token no header de todas as requisições protegidas:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

| Role | Permissões |
|------|-----------|
| `user` | Carrinho, favoritos, pedidos próprios, atualizar perfil |
| `admin` | Todas as permissões + gerenciar produtos, categorias, usuários e todos os pedidos |

---

## Paginação

```
GET /api/produtos?page=1&limit=10
GET /api/pedidos?page=1&limit=5
```

**Resposta:**
```json
{
  "produtos": [],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

---

## Validações

Erros de validação retornam `400`:

```json
{
  "erros": [
    {
      "type": "field",
      "msg": "Email inválido",
      "path": "email",
      "location": "body"
    }
  ]
}
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
- Todos os métodos dos services utilizam `async/await` para operações com o MongoDB

---

## Persistência de Dados

Os dados são persistidos no **MongoDB Atlas** via Mongoose. Os arquivos JSON locais foram mantidos para compatibilidade com o CLI:

- `backend/src/data/produtos.json`
- `backend/src/data/pedidos.json`

---

## Tecnologias Utilizadas

- HTML, CSS, JavaScript
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT (jsonwebtoken) + bcrypt
- express-validator
- Swagger UI / OpenAPI 3.0
- API ViaCEP
- CORS + dotenv
- Sistema de arquivos nativo (`fs`) do Node.js