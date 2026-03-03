const ProdutoService = require('../services/produtoService');
const Pedido = require('../models/Pedido');
const PedidoComDesconto = require('../models/PedidoComDesconto');
const PedidoService = require('../services/pedidoService');

const produtoService = new ProdutoService();

// try {
//   const produtos = [
//     {
//       nome: 'Notebook',
//       preco: 3500,
//       categoria: 'Eletrônicos',
//       estoque: 10,
//       img: 'assets/notebook.png',
//     },
//     {
//       nome: 'Smartphone',
//       preco: 2200,
//       categoria: 'Eletrônicos',
//       estoque: 25,
//       img: 'assets/smartphone.png',
//     },
//     {
//       nome: 'Monitor 24"',
//       preco: 1100,
//       categoria: 'Eletrônicos',
//       estoque: 15,
//       img: 'assets/monitor.png',
//     },
//     {
//       nome: 'Cadeira',
//       preco: 800,
//       categoria: 'Móveis',
//       estoque: 15,
//       img: 'assets/cadeira.png',
//     },
//     {
//       nome: 'Teclado Mecânico',
//       preco: 350,
//       categoria: 'Eletrônicos',
//       estoque: 30,
//       img: 'assets/teclado.png',
//     },
//     {
//       nome: 'Mouse Gamer',
//       preco: 280,
//       categoria: 'Eletrônicos',
//       estoque: 40,
//       img: 'assets/mouse.png',
//     },
//     {
//       nome: 'Headset',
//       preco: 450,
//       categoria: 'Eletrônicos',
//       estoque: 20,
//       img: 'assets/headset.png',
//     },
//     {
//       nome: 'Webcam Full HD',
//       preco: 320,
//       categoria: 'Eletrônicos',
//       estoque: 18,
//       img: 'assets/webcam.png',
//     },
//   ];

//   for (const p of produtos) {
//     produtoService.criar(p.nome, p.preco, p.categoria, p.estoque, p.img); // ✅ passa img
//   }

//   console.log('BD populado com sucesso! Total:', produtos.length, 'produtos');
//   console.log(produtoService.listarTodos());
// } catch (error) {
//   console.error('Erro ao popular o BD:', error.message);
// }
// try {
// console.log("\n========== TESTE DE PEDIDO INVÁLIDO ==========");  // Produto inválido (objeto literal)
//   const pedidoInvalido = new Pedido([
//     { produto: { preco: 100 }, quantidade: 1 }
//   ]);

//   console.log(pedidoInvalido.calculadoraTotal());

// } catch (error) {
//   console.error('Erro esperado:', error.message);
// }
// try {
//   console.log('============TESTE PARA CRIAR UM PRODUTO COM SUCESSO=========');
//   const novoProduto = produtoService.criar('Notebook', 3500, 'Eletrônicos', 10);
//   console.log('Produto criado com sucesso');
//   console.log(novoProduto);
// } catch (error) {
//   console.log('Error ao criar o produto');
//   console.log(error.message);
// }

// try {
//   console.log('============TESTE PARA LISTAR OS PRODUTO COM SUCESSO=========');
//   console.log(produtoService.listarTodos());
// } catch (error) {
//   console.log('Error ao listar todos os produtos');
//   console.log(error.message);
// }

// try {
//   console.log(
//     '============TESTE PARA CALCULAR A MÉDIAS DO PREÇO DOS PRODUTO COM SUCESSO=========',
//   );
//   console.log(produtoService.calcularMediaPreco());

// } catch (error) {
//   console.log("Error ao calcular médias dos preços dos produtos");

// }

// ============LIMPEZA DO BD ===========

// try {
//   console.log('============TESTE PARA LIMPAR BD=========');
//   console.log(produtoService.limparBanco());
// } catch (error) {
//   console.log('Error ao calcular médias dos preços dos produtos');
// }

// ========LIMPEZA DE PEDIDOS
try {
  console.log('===== LIMPEZA DE PEDIDOS =====');
  const pedidoService = new PedidoService();
  pedidoService.limparTodosOsPedidos();
  console.log('Pedidos limpos com sucesso');
} catch (error) {
  console.log('Erro ao limpar os pedidos');
  console.log(error.message);
}


// ========LIMPEZA DE PEDISO

// try {
//   console.log('============TESTE PARA LISTAR OS PRODUTO COM SUCESSO=========');
//   console.log(produtoService.listarTodos());
// } catch (error) {
//   console.log('Error ao listar todos os produtos');
//   console.log(error.message);
// }

// PARA AMBIENTE DE TESTES============

// Criar um arquivo produtos.test.json

// Ou usar uma flag de ambiente

// Exemplo:

// const ARQUIVO = process.env.NODE_ENV === 'test'
//   ? path.join(__dirname, '../data/produtos.test.json')
//   : path
