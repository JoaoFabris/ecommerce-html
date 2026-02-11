const catalogoProdutos = [
  { nome: 'Camiseta Básica', preco: 59.9, categoria: 'Vestuário' },
  { nome: 'Tênis Casual', preco: 199.9, categoria: 'Calçados' },
  { nome: 'Boné', preco: 39.9, categoria: 'Acessórios' },
  { nome: 'Mochila', preco: 149.9, categoria: 'Acessórios' },
];

//============RENDERIZA O MOCK DO CATALOGO
function renderCatalog() {
  const container = document.getElementById('catalogo');
  container.innerHTML = '';

  catalogoProdutos.forEach((e) => {
    const card = document.createElement('div');
    card.innerHTML = `
      <h3>${e.nome}</h3>
      <p><strong>Categoria:</strong> ${e.categoria}</p>
      <p><strong>Preço:</strong> R$ ${e.preco.toFixed(2)}</p>
      <hr />
    `;
    container.appendChild(card);
  });
}

//============= FAZ A CALCULADORA DE DESCONTO
function calculadoraDesconto(valor, percent) {
  const desconto = valor - (valor * percent) / 100;
  return desconto;
}

//============= FAZ AS AÇÕES DO BTN
document.getElementById('btnCalcular').addEventListener('click', () => {
  const valor = Number(document.getElementById('valor').value);
  const percent = Number(document.getElementById('desconto').value);
  const resultado = document.getElementById('resultado');

  // validações
  if (!valor || valor <= 0) {
    resultado.textContent = 'informe um valor válido';
    return;
  }
  if (percent < 0 || percent > 100) {
    resultado.textContent = 'informe um percentual válido';
    return;
  }

  const desconto = calculadoraDesconto(valor, percent);

  resultado.textContent = `Resultado: R$ ${desconto.toFixed(2)}`;
});

//====== buscar CEP API

async function buscarEnderecoCep(cep) {
  if (cep.length !== 8) {
    throw new Error('CEP inválido. Digite 8 números.');
  }

  const url = `https://viacep.com.br/ws/${cep}/json/`;

  const response = await fetch(url);

  if (!response.ok) {
    // retorno boolean da fetch da url
    throw new Error('Erro ao consultar o CEP.');
  }

  const data = await response.json();

  if (data.erro) {
    throw new Error('CEP não encontrado!');
  }

  return data;
}

//=========== EVENTO PARA BTN DO CEP

document.getElementById('btnBuscar').addEventListener('click', async () => {
  const cepValue = document.getElementById('cep').value;
  console.log(cepValue);
  const resultadoCep = document.getElementById('resultadoCep');

  try {
    const responseApi = await buscarEnderecoCep(cepValue);
    const enderecoResponseApi = {
      logradouro: responseApi.logradouro,
      bairro: responseApi.bairro,
      cidade: responseApi.localidade,
      uf: responseApi.uf,
      cep: responseApi.cep,
    };

    resultadoCep.innerHTML = `
  <strong>Logradouro:</strong> ${enderecoResponseApi.logradouro}
  <strong>Bairro:</strong>     ${enderecoResponseApi.bairro}
  <strong>Cidade:</strong>     ${enderecoResponseApi.cidade}
  <strong>Estado:</strong>     ${enderecoResponseApi.uf}
  <strong>CEP:</strong>        ${enderecoResponseApi.cep}
`;
  } catch (error) {
    resultadoCep.textContent = 'Error na Consulta';
  }
});

renderCatalog();
