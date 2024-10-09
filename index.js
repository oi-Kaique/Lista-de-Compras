// Espera que o conteúdo da página seja completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    
    // Cria uma nova div para o logo e o título da aplicação
    const divLogo = document.createElement('div'); // Cria uma nova div
    divLogo.classList.add('div-logo'); // Adiciona uma classe à div para estilização
    const imgLogo = document.createElement('img'); // Cria um novo elemento de imagem
    const h1Logo = document.createElement('h1'); // Cria um novo elemento de cabeçalho (h1)
    
    // Define o texto e a imagem do logo
    h1Logo.textContent = 'QuickList'; // Define o texto do cabeçalho
    imgLogo.src = "./assets/logo03.svg"; // Define o caminho para a imagem do logo
    imgLogo.alt = "Logo do site"; // Define o texto alternativo da imagem (acessibilidade)
    
    // Adiciona o logo e o título ao corpo do documento HTML
    document.body.appendChild(divLogo); // Adiciona a div do logo ao corpo
    divLogo.appendChild(imgLogo); // Adiciona a imagem à div do logo
    divLogo.appendChild(h1Logo); // Adiciona o título à div do logo
    
    // Adiciona uma classe ao corpo da página para estilização
    const body = document.querySelector('body'); // Seleciona o elemento body
    body.classList.add('body'); // Adiciona uma classe ao body

    // Cria uma nova div que vai conter a lista de compras
    const divContainer = document.createElement('div'); // Cria uma nova div para a lista
    const divSearch = document.createElement('div'); // Cria uma nova div para o campo de busca
    divContainer.classList.add('container'); // Adiciona uma classe à divContainer para estilização
    divSearch.classList.add('search'); // Adiciona uma classe à divSearch para estilização

    // Cria um título (h1) para a lista de compras
    const h1 = document.createElement('h1'); // Cria um novo cabeçalho (h1)
    h1.textContent = "Compras da semana"; // Define o texto do cabeçalho
    divContainer.appendChild(h1); // Adiciona o título à divContainer
    document.body.appendChild(divContainer); // Adiciona a divContainer ao corpo do documento

    // Cria um campo de entrada de texto para adicionar itens
    const input = document.createElement('input'); // Cria um novo campo de entrada
    input.type = 'text'; // Define o tipo do input como 'text'
    input.placeholder = 'Adicione um novo item'; // Define um texto que aparece quando o campo está vazio
    divContainer.appendChild(divSearch); // Adiciona a divSearch à divContainer
    divSearch.appendChild(input); // Adiciona o campo de entrada à divSearch

    // Cria um botão que o usuário pode clicar para adicionar um item
    const button = document.createElement('button'); // Cria um novo botão
    button.classList.add('btn-add'); // Adiciona uma classe ao botão para estilização
    button.textContent = 'Adicionar Item'; // Define o texto que aparece no botão
    divSearch.appendChild(button); // Adiciona o botão à divSearch

    // Função para salvar os itens no localStorage
    function saveToLocalStorage(items) {
        // Converte o array de itens em uma string JSON e salva no localStorage
        localStorage.setItem('@github-favorites', JSON.stringify(items));
    }

    // Esta variável controla se uma adição de item está em andamento
    let isProcessing = false; // Inicialmente, não estamos processando nada

    // Este é o evento de clique no botão
    button.addEventListener('click', () => {
        // Se já estiver processando, ignore o clique
        if (isProcessing) return;

        // Marca que começou a processar
        isProcessing = true; // Define que o processamento começou
        button.disabled = true; // Desabilita o botão para evitar múltiplos cliques

        // Obtém o valor do input e remove espaços em branco no início e no fim
        const newItemValue = input.value.trim(); // Remove espaços em branco

        // Verifica se o campo de entrada está vazio
        if (newItemValue === '') {
            alert('Por favor, insira um item.'); // Alerta o usuário se não houver texto
            isProcessing = false; // Reseta o estado de processamento
            button.disabled = false; // Reabilita o botão
            return; // Sai da função se não houver texto
        }

        // Obtém todos os itens existentes na lista
        const existingItems = divContainer.querySelectorAll('.item-text'); // Seleciona todos os textos dos itens

        // Verifica se o item já existe na lista
        // Converte NodeList para Array e usa 'some' para verificação eficiente
        const isDuplicate = Array.from(existingItems).some(item => 
            item.textContent.toLowerCase() === newItemValue.toLowerCase() // Compara o novo item com os existentes
        );

        // Se o item for duplicado, alerta o usuário e sai da função
        if (isDuplicate) {
            alert('Este item já existe na lista.'); // Alerta o usuário
            isProcessing = false; // Reseta o estado de processamento
            button.disabled = false; // Reabilita o botão
            return; // Sai da função
        }

        // Adiciona o novo item à lista
        const newItem = addItem(newItemValue); // Chama a função addItem para criar um novo item
        divContainer.appendChild(newItem); // Adiciona o novo item à divContainer

        // Salva os itens no localStorage
        const currentItems = Array.from(divContainer.querySelectorAll('.item-text')).map(item => item.textContent); // Cria um array com os textos dos itens
        saveToLocalStorage(currentItems); // Salva o array no localStorage

        // Cria e adiciona a mensagem de confirmação
        const confirmationMessage = msgAddItem(); // Chama a função para criar a mensagem de confirmação
        divContainer.appendChild(confirmationMessage); // Adiciona a mensagem à divContainer

        // Limpa o campo de entrada
        input.value = ''; // Limpa o campo de entrada

        // Define um temporizador para remover a mensagem de confirmação após 2 segundos
        setTimeout(() => {
            // Remove a mensagem de confirmação
            divContainer.removeChild(confirmationMessage); // Remove a mensagem
            isProcessing = false; // Reseta o estado de processamento
            button.disabled = false; // Reabilita o botão
        }, 2000); // 2000 milissegundos = 2 segundos
    });

    // Função para adicionar um novo item à lista
    function addItem(itemText) {
        const divSelect = document.createElement('div'); // Cria uma nova div para o item
        divSelect.classList.add('item'); // Adiciona uma classe à div do item

        const divInputSelect = document.createElement('div'); // Cria uma nova div para o checkbox
        divInputSelect.classList.add('input-select'); // Adiciona uma classe para estilização

        // Cria um checkbox para o item (para marcar como comprado)
        const inputSelect = document.createElement('input'); 
        inputSelect.type = 'checkbox'; // Define o tipo do input como 'checkbox'

        // Cria um rótulo que mostrará o texto do item
        const label = document.createElement('label'); // Cria um novo elemento de rótulo
        label.textContent = itemText; // Define o texto do rótulo como o texto do novo item
        label.classList.add('item-text'); // Adiciona uma classe ao rótulo para identificação

        // Cria um botão de deletar ao lado do item
        const imgDelete = btnDelet(divSelect); // Chama a função para criar o botão de deletar

        // Adiciona o checkbox, o rótulo e o botão de deletar à div do item
        divSelect.appendChild(divInputSelect); // Adiciona a div para o checkbox à div do item
        divInputSelect.appendChild(inputSelect); // Adiciona o checkbox à div do checkbox
        divInputSelect.appendChild(label); // Adiciona o rótulo à div do checkbox
        divSelect.appendChild(imgDelete); // Adiciona o botão de deletar à div do item

        // Retorna a div do novo item completo
        return divSelect; // Retorna a div com o item criado
    }

    // Função que cria o botão de deletar e adiciona o evento de clique
    function btnDelet(parentDiv) {
        // Cria a imagem que servirá como botão de deletar
        const imgDelete = document.createElement('img'); 
        imgDelete.classList.add('img-delete'); // Adiciona uma classe à imagem
        imgDelete.src = './assets/delete01.svg'; // Define o caminho da imagem de deletar
        imgDelete.alt = 'Deletar'; // Define o texto alternativo (alt) para a imagem

        // Adiciona um evento de clique à imagem
        imgDelete.addEventListener('click', () => {
            parentDiv.remove(); // Remove a div do item quando o botão de deletar é clicado
            divContainer.appendChild(msgDelete()); // Adiciona a mensagem de item removido à lista

            // Define um temporizador para remover a mensagem de item removido após 2 segundos
            setTimeout(() => {
                divContainer.removeChild(divContainer.lastChild); // Remove a mensagem após 2 segundos
            }, 2000);

            // Atualiza o localStorage após remover um item
            const currentItems = Array.from(divContainer.querySelectorAll('.item-text')).map(item => item.textContent); // Cria um array com os textos dos itens
            saveToLocalStorage(currentItems); // Salva o array no localStorage
        });

        return imgDelete; // Retorna o botão de deletar
    }

    // Função que cria a mensagem de "item removido"
    function msgDelete() {
        const divMsgDelete = document.createElement('div'); // Cria uma nova div para a mensagem
        divMsgDelete.classList.add('msg-delete'); // Adiciona uma classe à div da mensagem
        const ImgError = document.createElement('img'); // Cria uma nova imagem para a mensagem
       
        ImgError.classList.add('img-error'); // Adiciona uma classe à imagem de erro
        ImgError.src = './assets/Icon.svg'; // Define o caminho da imagem de erro
        const msgDelete = document.createElement('p'); // Cria um novo parágrafo para a mensagem
        msgDelete.textContent = "O Item foi removido da lista"; // Define o texto da mensagem
        divMsgDelete.appendChild(msgDelete); // Adiciona o parágrafo à div da mensagem
        divMsgDelete.appendChild(ImgError); // Adiciona a imagem de erro à div da mensagem
        return divMsgDelete; // Retorna a div com a mensagem de item removido
    }

    // Função que cria a mensagem de "item adicionado"
    function msgAddItem() {
        const divMsgAddItem = document.createElement('div'); // Cria uma nova div para a mensagem
        divMsgAddItem.classList.add('msg-add-item'); // Adiciona uma classe à div da mensagem
        const ImgCheck = document.createElement('img'); // Cria uma nova imagem para a mensagem
        ImgCheck.classList.add('img-check'); // Adiciona uma classe à imagem de confirmação
        ImgCheck.src = './assets/check-circle-bold (1).svg'; // Define o caminho da imagem de confirmação
        const msgAddItem = document.createElement('p'); // Cria um novo parágrafo para a mensagem
        msgAddItem.textContent = "O Item foi adicionado à lista"; // Define o texto da mensagem
        divMsgAddItem.appendChild(msgAddItem); // Adiciona o parágrafo à div da mensagem
        divMsgAddItem.appendChild(ImgCheck); // Adiciona a imagem de confirmação à div da mensagem
        return divMsgAddItem; // Retorna a div com a mensagem de item adicionado
    }

    // Carrega os itens do localStorage quando a página é carregada
    const savedItems = JSON.parse(localStorage.getItem('@github-favorites')) || []; // Tenta recuperar os itens do localStorage ou cria um array vazio
    savedItems.forEach(item => {
        divContainer.appendChild(addItem(item)); // Adiciona cada item salvo à lista
    });

    // Função para atualizar o localStorage após modificações
    function updateLocalStorage() {
        const currentItems = Array.from(divContainer.querySelectorAll('.item-text')).map(item => item.textContent); // Cria um array com os textos dos itens
        saveToLocalStorage(currentItems); // Salva o array no localStorage
    }
});
