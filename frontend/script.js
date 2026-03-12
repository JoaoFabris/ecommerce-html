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
  <div class="card-acoes">
    <button class="btn-editar" data-id="${p.id}" title="Editar produto">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      Editar
    </button>
    <button class="btn-deletar" data-id="${p.id}" title="Deletar produto">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
      </svg>
      Deletar
    </button>
  </div>
`;

    // Seleção do produto ao clicar (evita disparar ao clicar nos botões)
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-editar') || e.target.closest('.btn-deletar'))
        return;

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
        .forEach((el) => el.classList.remove('selecionado'));
      card.classList.add('selecionado');
      renderPedido();
    });

    // Botão Deletar
    card.querySelector('.btn-deletar').addEventListener('click', async () => {
      if (!confirm(`Deseja deletar o produto "${p.nome}"?`)) return;
      await deletarProduto(p.id);
    });

    // Botão Editar
    card.querySelector('.btn-editar').addEventListener('click', () => {
      abrirModalEdicao(p);
    });

    container.appendChild(card);
  });
  renderPedido();
}

async function iniciarCatalogo() {
  try {
    const produtos = await carregarProdutos();
    renderCatalog(produtos);
  } catch (e) {
    document.getElementById('catalogo').textContent = e.message;
  }
}

//============= FAZ AS AÇÕES DO BTN PARA CALCULAR O DESCONTO
document.getElementById('btnCalcular').addEventListener('click', () => {
  const percent = Number(document.getElementById('desconto').value);
  const resultado = document.getElementById('resultado');

  if (!produtoSelecionado) {
    resultado.textContent = 'Selecione um produto primeiro.';
    return;
  }

  if (percent < 0 || percent > 100) {
    resultado.textContent = 'Informe um percentual válido (0 a 100).';
    return;
  }

  const precoOriginal =
    Number(produtoSelecionado.preco) * Number(produtoSelecionado.qtdEscolhida);
  const precoFinal = precoOriginal - (precoOriginal * percent) / 100;

  produtoSelecionado.descontoPercentual = percent;
  produtoSelecionado.precoComDesconto = Number(precoFinal.toFixed(2));

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
    if (getComputedStyle(secPedidos).display !== 'none') {
      await carregarPedidos();
    }
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

  // ALTERAÇÕES PARA DELETAR E ALTERAR PEDIDOS

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
    <div class="card-acoes">
      <button class="btn-editar" title="Alterar status">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Editar
      </button>
      <button class="btn-deletar" title="Deletar pedido">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
        Deletar
      </button>
    </div>
    <hr>
  `;

    div.querySelector('.btn-deletar').addEventListener('click', async () => {
      if (!confirm(`Deseja deletar o pedido ${pedido.id}?`)) return;
      await deletarPedido(pedido.id);
    });

    div.querySelector('.btn-editar').addEventListener('click', () => {
      abrirModalStatusPedido(pedido);
    });

    listaPedidos.appendChild(div);
  });
}

async function deletarPedido(id) {
  try {
    const res = await fetch(`/api/pedidos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao deletar pedido');
      return;
    }
    alert('Pedido deletado com sucesso!');
    await carregarPedidos();
  } catch (e) {
    alert('Erro ao conectar com o servidor.');
  }
}

function abrirModalStatusPedido(pedido) {
  document.getElementById('modal-edicao')?.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-edicao';
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box">
        <h3>Alterar Status do Pedido</h3>
        <p><strong>ID:</strong> ${pedido.id}</p>
        <label>Status</label>
        <select id="edit-status">
          <option value="pendente"  ${pedido.status === 'pendente' ? 'selected' : ''}>Pendente</option>
          <option value="enviado"   ${pedido.status === 'enviado' ? 'selected' : ''}>Enviado</option>
          <option value="entregue"  ${pedido.status === 'entregue' ? 'selected' : ''}>Entregue</option>
        </select>
        <div class="modal-btns">
          <button id="btn-salvar-edicao">💾 Salvar</button>
          <button id="btn-cancelar-edicao">Cancelar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document
    .getElementById('btn-cancelar-edicao')
    .addEventListener('click', () => modal.remove());

  document
    .getElementById('btn-salvar-edicao')
    .addEventListener('click', async () => {
      const novoStatus = document.getElementById('edit-status').value;

      try {
        const res = await fetch(`/api/pedidos/${pedido.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: novoStatus }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Erro ao atualizar');
          return;
        }
        alert('Status atualizado!');
        modal.remove();
        await carregarPedidos();
      } catch (e) {
        alert('Erro ao conectar com o servidor.');
      }
    });
}

// AÇÃO PARA CADASTRAR PRODUTO PELO PAINEL FRONT

const btnCadastrarProduto = document.getElementById('btnCadastrarProduto');

btnCadastrarProduto.addEventListener('click', cadastrarProduto);

async function cadastrarProduto() {
  const nome = document.getElementById('produtoNome').value;
  const preco = Number(document.getElementById('produtoPreco').value);
  const categoria = document.getElementById('produtoCategoria').value;
  const quantidade = Number(document.getElementById('produtoQuantidade').value);
  const img = document.getElementById('produtoImg').value;

  if (!nome || !preco || !categoria || !quantidade) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  //(que o fetch utiliza) não entende objetos do JavaScript. Ele só entende texto (strings)
  try {
    const res = await fetch('/api/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome,
        preco,
        categoria,
        quantidade,
        img,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Erro ao cadastrar produto');
      return;
    }

    alert('Produto cadastrado com sucesso!');

    // atualizar catálogo
    await iniciarCatalogo();
  } catch (error) {
    alert('Erro ao conectar com o servidor.');
  }
}

async function deletarProduto(id) {
  try {
    const res = await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao deletar produto');
      return;
    }
    alert('Produto deletado com sucesso!');
    await iniciarCatalogo();
  } catch (e) {
    alert('Erro ao conectar com o servidor.');
  }
}

function abrirModalEdicao(produto) {
  // Remove modal anterior se existir
  document.getElementById('modal-edicao')?.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-edicao';
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-box">
        <h3>Editar Produto</h3>
        <input type="text"   id="edit-nome"      placeholder="Nome"       value="${produto.nome}" />
        <input type="number" id="edit-preco"     placeholder="Preço"      value="${produto.preco}" />
        <input type="text"   id="edit-categoria" placeholder="Categoria"  value="${produto.categoria}" />
        <input type="number" id="edit-quantidade" placeholder="Quantidade" value="${produto.quantidade}" />
        <input type="text"   id="edit-img"       placeholder="Imagem"     value="${produto.img || ''}" />
        <div class="modal-btns">
          <button id="btn-salvar-edicao">💾 Salvar</button>
          <button id="btn-cancelar-edicao">Cancelar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document
    .getElementById('btn-cancelar-edicao')
    .addEventListener('click', () => modal.remove());

  document
    .getElementById('btn-salvar-edicao')
    .addEventListener('click', async () => {
      const body = {
        nome: document.getElementById('edit-nome').value,
        preco: Number(document.getElementById('edit-preco').value),
        categoria: document.getElementById('edit-categoria').value,
        quantidade: Number(document.getElementById('edit-quantidade').value),
        img: document.getElementById('edit-img').value,
      };

      try {
        const res = await fetch(`/api/produtos/${produto.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Erro ao editar');
          return;
        }
        alert('Produto atualizado!');
        modal.remove();
        await iniciarCatalogo();
      } catch (e) {
        alert('Erro ao conectar com o servidor.');
      }
    });
}

iniciarCatalogo();
