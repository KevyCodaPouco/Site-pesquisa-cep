
// Formata o CEP
function formatCEP(input) {
  let value = input.value.replace(/\D/g, '');

  if (value.length > 5) {
    value = value.substring(0, 5) + '-' + value.substring(5, 8);
  }

  input.value = value;
}

// Realiza busca via API
function searchCEP() {
  const cepInput = document.getElementById('cep');
  const cep = cepInput.value.replace(/\D/g, '');

  // Limpar a pesquisa anterior
  document.getElementById('resultContainer').classList.add('hidden');
  document.getElementById('errorContainer').classList.add('hidden');

  // Validar o cep
  if (cep.length !== 8) {
    showError('CEP inválido! Digite exatamente 8 dígitos.');
    cepInput.classList.add('shake', 'border-red-500');
    setTimeout(() => {
      cepInput.classList.remove('shake');
    }, 500);
    return;
  }

  // carregamento
  document.getElementById('loadingContainer').classList.remove('hidden');

  // usando a API via ViaCEP
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => {
      if (!response.ok) {
        throw new Error('CEP não encontrado');
      }
      return response.json();
    })
    .then(data => {
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }
      displayResults(data);
    })
    .catch(error => {
      showError(/* error.message || */ 'Ocorreu um erro ao buscar o CEP. Tente novamente.');
    })
    .finally(() => {
      document.getElementById('loadingContainer').classList.add('hidden');
    });
}

// resultado da pequisa via api
function displayResults(data) {
  const resultContainer = document.getElementById('resultContainer');
  const addressData = document.getElementById('addressData');

  // HTML com as informações do CEP
  addressData.innerHTML = `
                <div class="flex items-start">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <i class="fas fa-road text-indigo-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-500">Logradouro</p>
                        <p class="text-sm text-gray-900">${data.logradouro || 'Não informado'}</p>
                    </div>
                </div>
                
                <div class="flex items-start">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <i class="fas fa-map-marker-alt text-indigo-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-500">Bairro</p>
                        <p class="text-sm text-gray-900">${data.bairro || 'Não informado'}</p>
                    </div>
                </div>
                
                <div class="flex items-start">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <i class="fas fa-city text-indigo-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-500">Cidade/UF</p>
                        <p class="text-sm text-gray-900">${data.localidade || 'Não informado'}/${data.uf || 'Não informado'}</p>
                    </div>
                </div>
                
                <div class="flex items-start">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <i class="fas fa-mail-bulk text-indigo-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-500">CEP</p>
                        <p class="text-sm text-gray-900">${data.cep || 'Não informado'}</p>
                    </div>
                </div>
            `;

  // Animação com os resultados
  resultContainer.classList.remove('hidden');
  addressData.classList.add('fade-in');
}

// Mensagem de erro
function showError(message) {
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');

  errorMessage.textContent = message;
  errorContainer.classList.remove('hidden');
}

// Pesquisa
document.getElementById('cep').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchCEP();
  }
});