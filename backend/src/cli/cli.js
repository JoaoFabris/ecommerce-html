const prompt = require('prompt-sync')();
const ProdutoService = require('../services/produtoService');
const PedidoService = require('../services/pedidoService');

const produtoService = new ProdutoService();
const pedidoService = new PedidoService();

async function menu() {
  console.log('\n===== SISTEMA DE GESTÃO DE VENDAS =====');
  console.log('1 - Cadastrar Produto');
  console.log('2 - Listar Produtos');
  console.log('3 - Média de Preços');
  console.log('4 - Criar Pedido');
  console.log('5 - Listar Pedidos');
  console.log('0 - Sair');

  const opcao = prompt('Escolha uma opção: ');

  switch (opcao) {
    case '1':
      cadastrarProduto();
      break;

    case '2':
      listarProdutos();
      break;

    case '3':
      calcularMedia();
      break;

    case '4':
      criarPedido();
      break;

    case '5':
      listarPedidos();
      break;

    case '0':
      console.log('Encerrando...');
      return;

    default:
      console.log('Opção inválida');
  }

  await menu();
}

function cadastrarProduto() {
  try {
    const nome = prompt('Nome do produto: ');
    const preco = Number(prompt('Preço: '));
    const categoria = prompt('Categoria: ');
    const quantidade = Number(prompt('Quantidade em estoque: '));

    produtoService.criar(nome, preco, categoria, quantidade);

    console.log('Produto cadastrado com sucesso!');
  } catch (e) {
    console.log('Erro:', e.message);
  }
}

function listarProdutos() {
  const produtos = produtoService.listarTodos();
  console.table(produtos);
}

function calcularMedia() {
  const media = produtoService.calcularMediaPreco();
  console.log(`Média de preços: R$ ${media}`);
}

function criarPedido() {
  try {
    const produtos = produtoService.listarTodos();

    console.table(produtos);

    const id = prompt('Digite o ID do produto: ');
    const quantidade = Number(prompt('Quantidade: '));

    const produto = produtoService.buscarPorId(id);

    if (!produto) {
      console.log('Produto não encontrado');
      return;
    }

    const pedido = pedidoService.criar(produto, quantidade);

    console.log('Pedido criado com sucesso!');
    console.log(pedido);
  } catch (e) {
    console.log('Erro:', e.message);
  }
}
function listarPedidos() {
  const pedidos = pedidoService.listaTodosOsPedidos();

  const resumo = pedidos.map((p) => ({
    id: p.id,
    status: p.status,
    total: `R$ ${Number(p.total).toFixed(2)}`,
    data: new Date(p.dataCriacao).toLocaleString('pt-BR'),
    itens: (p.produtos || [])
      .map((i) => `${i.quantidade}x ${i.produto?.nome ?? 'Produto'}`)
      .join(' | ')
  }));

  console.table(resumo);
}

menu();