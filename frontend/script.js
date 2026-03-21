// ========== AUTENTICAÇÃO
const token = localStorage.getItem('token');
const tokenAdmin = localStorage.getItem('token_admin');
const role = localStorage.getItem('role');
const nome = localStorage.getItem('nome');

// Redireciona para login se não estiver logado
if (!token) window.location.href = '/login.html';

// Exibe nome e badge admin
document.getElementById('nomeUsuario').textContent = `Olá, ${nome || 'Usuário'}!`;
if (role === 'admin') {
  document.getElementById('badgeAdmin').style.display = 'inline';
  // Mostra seção de cadastro apenas para admin
  document.getElementById('secCadastro').style.display = 'block';
  // Mostra botões de editar/deletar nos cards (via CSS class)
  document.body.classList.add('is-admin');
}

// Logout
document.getElementById('btnLogout').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '/login.html';
});

// ========== ESTADO
let produtoSelecionado = null;
let enderecoSelecionado = null;
let valorFrete = null;

// ========== HELPERS DE TOKEN
function getToken() { return localStorage.getItem('token') || ''; }
function getTokenAdmin() { return localStorage.getItem('token_admin') || ''; }
function authHeader() { return { 'Authorization': `Bearer ${getToken()}` }; }
function adminHeader() { return { 'Authorization': `Bearer ${getTokenAdmin()}` }; }

// ========== CARREGA PRODUTOS
async function carregarProdutos() {
  const res = await fetch('/api/produtos?page=1&limit=100');
  if (!res.ok) throw new Error('Falha ao carregar produtos');
  const data = await res.json();
  return data.produtos;
}

// ========== CARREGA CATEGORIAS
async function carregarCategorias() {
  try {
    const res = await fetch('/api/categorias');
    if (!res.ok) return;
    const categorias = await res.json();
    const select = document.getElementById('produtoCategoria');
    if (!select) return;
    select.innerHTML = '<option value="">Selecione uma categoria</option>';
    categorias.forEach((cat) => {
      const option = document.createElement('option');
      option.value = cat._id;
      option.textContent = cat.nome;
      select.appendChild(option);
    });
  } catch (e) {
    console.error('Erro ao carregar categorias:', e.message);
  }
}

// ========== RENDERIZA RESUMO DO PEDIDO
function renderPedido() {
  const container = document.getElementById('resumoPedido');
  container.innerHTML = '';

  if (!produtoSelecionado || !enderecoSelecionado || valorFrete === null) {
    container.textContent = 'Selecione um produto e informe o CEP para ver o resumo.';
    return;
  }

  const preco = produtoSelecionado.precoComDesconto ?? produtoSelecionado.preco;
  const quantidade = produtoSelecionado.qtdEscolhida ?? 1;
  const total = preco + valorFrete;

  container.innerHTML = `
   ${produtoSelecionado.img ? `<img src="/${produtoSelecionado.img}" alt="${produtoSelecionado.nome}" style="width:100%;max-height:150px;object-fit:contain;">` : ''}
<strong>Produto:</strong>  ${produtoSelecionado.nome}
<strong>Quantidade:</strong>  ${quantidade}
<strong>Preço:</strong>    R$ ${Number(preco).toFixed(2)}
<strong>Endereço:</strong> ${enderecoSelecionado.logradouro || '-'}, ${enderecoSelecionado.bairro || '-'}
<strong>Cidade:</strong>   ${enderecoSelecionado.localidade || '-'} - ${enderecoSelecionado.uf || '-'}
<strong>Frete:</strong>    R$ ${Number(valorFrete).toFixed(2)}
<strong>Total:</strong>    R$ ${Number(total).toFixed(2)}
  `;
}

// ========== RENDERIZA CATÁLOGO
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

    const categoriaNome = p.categoria?.nome || p.categoria || '-';
    const isAdmin = role === 'admin';

    card.innerHTML = `
  ${p.img ? `<img src="/${p.img}" alt="${p.nome}" style="width:100%;max-height:150px;object-fit:contain;">` : ''}
  <h3>${p.nome}</h3>
  <p><strong>Categoria:</strong> ${categoriaNome}</p>
  <p><strong>Preço:</strong> R$ ${Number(p.preco).toFixed(2)}</p>
  <p><strong>Estoque:</strong> ${p.quantidade}</p>
  <label>Quantidade:</label>
  <input type="number" class="input-quantidade" value="1" min="1" max="${p.quantidade}">
  <hr />
  ${isAdmin ? `
  <div class="card-acoes">
    <button class="btn-editar" data-id="${p._id}" title="Editar produto">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      Editar
    </button>
    <button class="btn-deletar" data-id="${p._id}" title="Deletar produto">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
      </svg>
      Deletar
    </button>
  </div>` : ''}
`;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-editar') || e.target.closest('.btn-deletar')) return;
      const inputQtd = card.querySelector('.input-quantidade');
      const qtdEscolhida = Number(inputQtd.value);
      if (qtdEscolhida <= 0 || qtdEscolhida > p.quantidade) {
        alert(`Quantidade inválida. Disponível: ${p.quantidade}`); return;
      }
      produtoSelecionado = { ...p, qtdEscolhida };
      const totalSemDesconto = Number(p.preco) * qtdEscolhida;
      document.getElementById('produtoSelecionadoInfo').textContent =
        `Selecionado: ${p.nome} | Qtd: ${qtdEscolhida} | Total: R$ ${totalSemDesconto.toFixed(2)}`;
      document.getElementById('valor').value = totalSemDesconto;
      document.querySelectorAll('#catalogo .card-produto').forEach((el) => el.classList.remove('selecionado'));
      card.classList.add('selecionado');
      renderPedido();
    });

    if (isAdmin) {
      card.querySelector('.btn-deletar')?.addEventListener('click', async () => {
        if (!confirm(`Deseja deletar o produto "${p.nome}"?`)) return;
        await deletarProduto(p._id);
      });
      card.querySelector('.btn-editar')?.addEventListener('click', () => abrirModalEdicao(p));
    }

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

// ========== CALCULADORA DE DESCONTO
document.getElementById('btnCalcular').addEventListener('click', () => {
  const percent = Number(document.getElementById('desconto').value);
  const resultado = document.getElementById('resultado');
  if (!produtoSelecionado) { resultado.textContent = 'Selecione um produto primeiro.'; return; }
  if (percent < 0 || percent > 100) { resultado.textContent = 'Informe um percentual válido (0 a 100).'; return; }
  const precoOriginal = Number(produtoSelecionado.preco) * Number(produtoSelecionado.qtdEscolhida);
  const precoFinal = precoOriginal - (precoOriginal * percent) / 100;
  produtoSelecionado.descontoPercentual = percent;
  produtoSelecionado.precoComDesconto = Number(precoFinal.toFixed(2));
  renderPedido();
  resultado.textContent = `Quantidade ${produtoSelecionado.qtdEscolhida} | Produto: ${produtoSelecionado.nome} | De R$ ${precoOriginal.toFixed(2)} por R$ ${produtoSelecionado.precoComDesconto.toFixed(2)}`;
});

// ========== CEP
async function buscarCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) throw new Error('CEP inválido. Digite 8 números.');
  const response = await fetch(`/api/cep/${cepLimpo}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erro ao consultar CEP');
  return data;
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
    enderecoSelecionado = responseApi;
    valorFrete = valorFreteTeste;
    renderPedido();
    resultadoCep.innerHTML = `
<strong>Logradouro:</strong> ${responseApi.logradouro || '-'}
<strong>Bairro:</strong>     ${responseApi.bairro || '-'}
<strong>Cidade:</strong>     ${responseApi.localidade || '-'}
<strong>Estado:</strong>     ${responseApi.uf || '-'}
<strong>CEP:</strong>        ${responseApi.cep || '-'}
<strong>Frete:</strong>      R$ ${valorFreteTeste.toFixed(2)}
`;
  } catch (error) { resultadoCep.textContent = error.message; }
});

// ========== FAZER PEDIDO
document.getElementById('btnPedido').addEventListener('click', async () => {
  if (!produtoSelecionado || !enderecoSelecionado) {
    alert('Selecione um produto e informe o CEP.'); return;
  }
  const payload = {
    produto: { id: produtoSelecionado._id },
    quantidade: produtoSelecionado.qtdEscolhida ?? 1,
    endereco: enderecoSelecionado,
    frete: valorFrete,
  };
  try {
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) { alert(`Erro: ${data.error}`); return; }
    alert(`Pedido realizado! ID: ${data._id}`);
    if (getComputedStyle(secPedidos).display !== 'none') await carregarPedidos();
  } catch (e) { alert('Erro ao conectar com o servidor.'); }
});

// ========== VER PEDIDOS
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

// ========== CARREGAR PEDIDOS
async function carregarPedidos() {
  const headers = role === 'admin' ? adminHeader() : authHeader();
  const res = await fetch('/api/pedidos', { headers });
  if (!res.ok) { listaPedidos.innerHTML = '<p>Sem permissão para ver pedidos.</p>'; return; }
  const data = await res.json();
  const pedidos = data.pedidos ?? data;
  listaPedidos.innerHTML = '';
  if (!pedidos.length) { listaPedidos.innerHTML = '<p>Nenhum pedido encontrado.</p>'; return; }

  pedidos.forEach((pedido) => {
    const div = document.createElement('div');
    const itens = (pedido.itens || [])
      .map((item) => `${item.produto?.nome || '-'} x${item.quantidade} — R$ ${Number(item.precoUnitario * item.quantidade).toFixed(2)}`)
      .join('<br>');

    const isAdmin = role === 'admin';

    div.innerHTML = `
    <strong>ID:</strong> ${pedido._id} <br>
    <strong>Status:</strong> ${pedido.status} <br>
    <strong>Itens:</strong><br> ${itens} <br>
    <strong>Total:</strong> R$ ${Number(pedido.total).toFixed(2)} <br>
    <strong>Data:</strong> ${new Date(pedido.createdAt).toLocaleString('pt-BR')} <br>
    ${isAdmin ? `
    <div class="card-acoes">
      <button class="btn-editar" title="Alterar status">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>Editar
      </button>
      <button class="btn-deletar" title="Deletar pedido">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>Deletar
      </button>
    </div>` : ''}
    <hr>
  `;

    if (isAdmin) {
      div.querySelector('.btn-deletar')?.addEventListener('click', async () => {
        if (!confirm(`Deseja deletar o pedido ${pedido._id}?`)) return;
        await deletarPedido(pedido._id);
      });
      div.querySelector('.btn-editar')?.addEventListener('click', () => abrirModalStatusPedido(pedido));
    }

    listaPedidos.appendChild(div);
  });
}

async function deletarPedido(id) {
  try {
    const res = await fetch(`/api/pedidos/${id}`, { method: 'DELETE', headers: adminHeader() });
    if (!res.ok) { const data = await res.json(); alert(data.error || 'Erro ao deletar pedido'); return; }
    alert('Pedido deletado com sucesso!');
    await carregarPedidos();
  } catch (e) { alert('Erro ao conectar com o servidor.'); }
}

function abrirModalStatusPedido(pedido) {
  document.getElementById('modal-edicao')?.remove();
  const modal = document.createElement('div');
  modal.id = 'modal-edicao';
  modal.innerHTML = `
    <div class="modal-overlay"><div class="modal-box">
      <h3>Alterar Status do Pedido</h3>
      <p><strong>ID:</strong> ${pedido._id}</p>
      <label>Status</label>
      <select id="edit-status">
        <option value="pendente"  ${pedido.status === 'pendente'  ? 'selected' : ''}>Pendente</option>
        <option value="enviado"   ${pedido.status === 'enviado'   ? 'selected' : ''}>Enviado</option>
        <option value="entregue"  ${pedido.status === 'entregue'  ? 'selected' : ''}>Entregue</option>
        <option value="cancelado" ${pedido.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
      </select>
      <div class="modal-btns">
        <button id="btn-salvar-edicao">💾 Salvar</button>
        <button id="btn-cancelar-edicao">Cancelar</button>
      </div>
    </div></div>`;
  document.body.appendChild(modal);
  document.getElementById('btn-cancelar-edicao').addEventListener('click', () => modal.remove());
  document.getElementById('btn-salvar-edicao').addEventListener('click', async () => {
    const novoStatus = document.getElementById('edit-status').value;
    try {
      const res = await fetch(`/api/pedidos/${pedido._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...adminHeader() },
        body: JSON.stringify({ status: novoStatus }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Erro ao atualizar'); return; }
      alert('Status atualizado!');
      modal.remove();
      await carregarPedidos();
    } catch (e) { alert('Erro ao conectar com o servidor.'); }
  });
}

// ========== CADASTRAR PRODUTO (admin)
const btnCadastrarProduto = document.getElementById('btnCadastrarProduto');
if (btnCadastrarProduto) {
  btnCadastrarProduto.addEventListener('click', cadastrarProduto);
}

async function cadastrarProduto() {
  const nome = document.getElementById('produtoNome').value;
  const preco = Number(document.getElementById('produtoPreco').value);
  const categoria = document.getElementById('produtoCategoria').value;
  const quantidade = Number(document.getElementById('produtoQuantidade').value);
  const img = document.getElementById('produtoImg').value;
  if (!nome || !preco || !categoria || !quantidade) { alert('Preencha todos os campos obrigatórios.'); return; }
  try {
    const res = await fetch('/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeader() },
      body: JSON.stringify({ nome, preco, categoria, quantidade, img }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error || 'Erro ao cadastrar produto'); return; }
    alert('Produto cadastrado com sucesso!');
    await iniciarCatalogo();
  } catch (error) { alert('Erro ao conectar com o servidor.'); }
}

async function deletarProduto(id) {
  try {
    const res = await fetch(`/api/produtos/${id}`, { method: 'DELETE', headers: adminHeader() });
    if (!res.ok) { const data = await res.json(); alert(data.error || 'Erro ao deletar produto'); return; }
    alert('Produto deletado com sucesso!');
    await iniciarCatalogo();
  } catch (e) { alert('Erro ao conectar com o servidor.'); }
}

function abrirModalEdicao(produto) {
  document.getElementById('modal-edicao')?.remove();
  const categoriaId = produto.categoria?._id || produto.categoria;
  const modal = document.createElement('div');
  modal.id = 'modal-edicao';
  modal.innerHTML = `
    <div class="modal-overlay"><div class="modal-box">
      <h3>Editar Produto</h3>
      <input type="text"   id="edit-nome"       placeholder="Nome"        value="${produto.nome}" />
      <input type="number" id="edit-preco"      placeholder="Preço"       value="${produto.preco}" />
      <input type="text"   id="edit-categoria"  placeholder="ID Categoria" value="${categoriaId}" />
      <input type="number" id="edit-quantidade" placeholder="Quantidade"   value="${produto.quantidade}" />
      <input type="text"   id="edit-img"        placeholder="Imagem"       value="${produto.img || ''}" />
      <div class="modal-btns">
        <button id="btn-salvar-edicao">💾 Salvar</button>
        <button id="btn-cancelar-edicao">Cancelar</button>
      </div>
    </div></div>`;
  document.body.appendChild(modal);
  document.getElementById('btn-cancelar-edicao').addEventListener('click', () => modal.remove());
  document.getElementById('btn-salvar-edicao').addEventListener('click', async () => {
    const body = {
      nome: document.getElementById('edit-nome').value,
      preco: Number(document.getElementById('edit-preco').value),
      categoria: document.getElementById('edit-categoria').value,
      quantidade: Number(document.getElementById('edit-quantidade').value),
      img: document.getElementById('edit-img').value,
    };
    try {
      const res = await fetch(`/api/produtos/${produto._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...adminHeader() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Erro ao editar'); return; }
      alert('Produto atualizado!');
      modal.remove();
      await iniciarCatalogo();
    } catch (e) { alert('Erro ao conectar com o servidor.'); }
  });
}

// ========== INICIALIZAÇÃO
iniciarCatalogo();
carregarCategorias();