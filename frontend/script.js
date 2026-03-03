let produtoSelecionado = null;
let enderecoSelecionado = null;
let valorFrete = null;
// ========== FAZ A CAHAMDA DOS PRODUTOS PELA ROTA
async function carregarProdutos() {
  const res = await fetch('/api/produtos');
  if (!res.ok) throw new Error('Falha ao carregar produtos');
  const data = await res.json();
  return data;
}

// RENDERIZAR RESUMO PEDIDO

function renderPedido() {
  const container = document.getElementById('resumoPedido');
  container.innerHTML = '';

  if (
    produtoSelecionado === null ||
    enderecoSelecionado === null ||
    valorFrete === null
  ) {
    container.textContent =
      'Selecione um produto e informe o CEP para ver o resumo.';
    return;
  }

  const preco = produtoSelecionado.precoComDesconto ?? produtoSelecionado.preco;
  const quantidade = produtoSelecionado.qtdEscolhida ?? 1;
  const total = preco + valorFrete;

  container.innerHTML = `
   ${produtoSelecionado.img ? `<img src="${produtoSelecionado.img}" alt="${produtoSelecionado.nome}" style="width:100%;max-height:150px;object-fit:contain;">` : ''}
<strong>Produto:</strong>  ${produtoSelecionado.nome}
<strong>Quantidade:</strong>  ${quantidade}
<strong>Preço:</strong>    R$ ${Number(preco).toFixed(2)}
<strong>Endereço:</strong> ${enderecoSelecionado.logradouro || '-'}, ${enderecoSelecionado.bairro || '-'}
<strong>Cidade:</strong>   ${enderecoSelecionado.localidade || '-'} - ${enderecoSelecionado.uf || '-'}
<strong>Frete:</strong>    R$ ${Number(valorFrete).toFixed(2)}
<strong>Total:</strong>    R$ ${Number(total).toFixed(2)}
  `;
}

// CALCULO DE QUANTIDADE

//============RENDERIZA DO CATALOGO
function renderCatalog(produtos) {
  const container = document.getElementById('catalogo');
  container.innerHTML = '';

  if (!Array.isArray(produtos) || produtos.length === 0) {
    container.textContent = 'Nenhum produto cadastrado.';
    return;
  }

  produtos.forEach((p) => {
    const card = document.createElement('div');
    card.classList.add('card-produto');

    card.innerHTML = `
  ${p.img ? `<img src="${p.img}" alt="${p.nome}" style="width:100%;max-height:150px;object-fit:contain;">` : ''}
  <h3>${p.nome}</h3>
  <p><strong>Categoria:</strong> ${p.categoria}</p>
  <p><strong>Preço:</strong> R$ ${Number(p.preco).toFixed(2)}</p>
  <p><strong>Estoque:</strong> ${p.quantidade}</p>
  <label>Quantidade:</label>
  <input type="number" class="input-quantidade" value="1" min="1" max="${p.quantidade}">
  <hr />
`;
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const inputQtd = card.querySelector('.input-quantidade');
      const qtdEscolhida = Number(inputQtd.value);

      if (qtdEscolhida <= 0 || qtdEscolhida > p.quantidade) {
        alert(`Quantidade inválida. Disponível: ${p.quantidade}`);
        return;
      }
      produtoSelecionado = { ...p, qtdEscolhida };
      const totalSemDesconto = Number(p.preco) * qtdEscolhida;
      document.getElementById('produtoSelecionadoInfo').textContent =
        `Selecionado: ${p.nome} | Qtd: ${qtdEscolhida} | Total: R$ ${totalSemDesconto.toFixed(2)}`;

      document.getElementById('valor').value = totalSemDesconto;

      document
        .querySelectorAll('#catalogo .card-produto')
        .forEach((el) => el.classList.remove('selecionado')); //remoce o selecionado ao clicar e outro
      card.classList.add('selecionado');
    });
    renderPedido();
    container.appendChild(card);
  });
}

async function iniciarCatalogo() {
  try {
    const produtos = await carregarProdutos();
    renderCatalog(produtos);
  } catch (e) {
    document.getElementById('catalogo').textContent = e.message;
  }
}

//============= FAZ A CALCULADORA DE DESCONTO
function calculadoraDesconto(valor, percent) {
  const desconto = valor - (valor * percent) / 100;
  return desconto;
}

//============= FAZ AS AÇÕES DO BTN PARA CALCULAR O DESCONTO
document.getElementById('btnCalcular').addEventListener('click', () => {
  const percent = Number(document.getElementById('desconto').value);
  const resultado = document.getElementById('resultado');

  if (percent < 0 || percent > 100) {
    resultado.textContent = 'Informe um percentual válido (0 a 100).';
    return;
  }

  const precoOriginal =
    Number(produtoSelecionado.preco) * Number(produtoSelecionado.qtdEscolhida);
  const precoFinal = precoOriginal - (precoOriginal * percent) / 100;

  // guarda para o pedido depois
  produtoSelecionado.descontoPercentual = percent;
  produtoSelecionado.precoComDesconto = Number(precoFinal.toFixed(2));
  console.log(produtoSelecionado);
  renderPedido();

  resultado.textContent = `Quantidade ${produtoSelecionado.qtdEscolhida} | Produto: ${produtoSelecionado.nome} | De R$ ${precoOriginal.toFixed(2)} por R$ ${produtoSelecionado.precoComDesconto.toFixed(2)}`;
});

//=========== EVENTO PARA BTN DO CEP

async function buscarCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    throw new Error('CEP inválido. Digite 8 números.');
  }

  const response = await fetch(`/api/cep/${cepLimpo}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro ao consultar CEP');
  }

  return data; // {logradouro, bairro, localidade, uf, cep}
}

function freteValorEstado(uf) {
  const table = { SP: 10, RJ: 15, MG: 12, SC: 13 };
  return table[uf] || 25;
}

document.getElementById('btnBuscar').addEventListener('click', async () => {
  const cepValue = document.getElementById('cep').value;
  const resultadoCep = document.getElementById('resultadoCep');

  try {
    const responseApi = await buscarCep(cepValue);
    const valorFreteTeste = freteValorEstado(responseApi.uf);
    console.log(valorFreteTeste);
    enderecoSelecionado = responseApi;
    valorFrete = valorFreteTeste;
    console.log(enderecoSelecionado, 'ende selecionado');
    renderPedido();

    resultadoCep.innerHTML = `
<strong>Logradouro:</strong> ${responseApi.logradouro || '-'}
<strong>Bairro:</strong>     ${responseApi.bairro || '-'}
<strong>Cidade:</strong>     ${responseApi.localidade || '-'}
<strong>Estado:</strong>     ${responseApi.uf || '-'}
<strong>CEP:</strong>        ${responseApi.cep || '-'}
<strong>VALOR:</strong>   R$:${valorFreteTeste.toFixed(2) || '-'}
`;
  } catch (error) {
    resultadoCep.textContent = error.message;
  }
});

// ========= AÇÃO DE FAZER PEDIDO

document.getElementById('btnPedido').addEventListener('click', async () => {
  if (!produtoSelecionado || !enderecoSelecionado) {
    alert('Selecione um produto e informe o CEP.');
    return;
  }

  const payload = {
    produto: produtoSelecionado,
    quantidade: produtoSelecionado.qtdEscolhida ?? 1,
    endereco: enderecoSelecionado,
    frete: valorFrete,
  };

  try {
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(`Erro: ${data.error}`); // ← mostra a mensagem real do backend
      return;
    }
    console.log(data);

    alert(`Pedido realizado! ID: ${data.id}, `);
  } catch (e) {
    alert('Erro ao conectar com o servidor.');
  }
});

// =========== AÇÃO DE BTN DE DEVI DOS PEDIDOS
const btnVerPedidos = document.getElementById('btnVerPedidos');
const secPedidos = document.getElementById('secPedidos');
const listaPedidos = document.getElementById('listaDosPedidos');

btnVerPedidos.addEventListener('click', async () => {
  const estaOculto = getComputedStyle(secPedidos).display === 'none';

  if (estaOculto) {
    secPedidos.style.display = 'block';
    btnVerPedidos.textContent = 'Ocultar Pedidos';
    await carregarPedidos();
  } else {
    secPedidos.style.display = 'none';
    btnVerPedidos.textContent = 'Ver os Pedidos';
  }
});

// ====== AÇÃO PARA CARREGAR PEDIDOS

async function carregarPedidos() {
  const res = await fetch('/api/pedidos');
  if (!res.ok) throw new Error('Falha ao carregar pedidos');

  const pedidos = await res.json();

  listaPedidos.innerHTML = '';

  if (!pedidos.length) {
    listaPedidos.innerHTML = '<p>Nenhum pedido encontrado.</p>';
    return;
  }

  pedidos.forEach((pedido) => {
    const div = document.createElement('div');

    const itens = pedido.produtos
      .map(
        (item) =>
          `${item.produto.nome} x${item.quantidade} — R$ ${Number(item.produto.preco * item.quantidade).toFixed(2)}`,
      )
      .join('<br>');

    div.innerHTML = `
    <strong>ID:</strong> ${pedido.id} <br>
    <strong>Status:</strong> ${pedido.status} <br>
    <strong>Itens:</strong><br> ${itens} <br>
    <strong>Total:</strong> R$ ${Number(pedido.total).toFixed(2)} <br>
    <strong>Data:</strong> ${new Date(pedido.dataCriacao).toLocaleString('pt-BR')} <br>
    <hr>
  `;

    listaPedidos.appendChild(div);
  });
}

iniciarCatalogo();
