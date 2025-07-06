// common.js - O nosso "espião" que avisa o Neocities

function updateParentHash() {
    // Só executa se o site estiver dentro de um iframe
    if (window.self !== window.top) {
        try {
            // Pega o caminho relativo da página atual (ex: "videoPlayer.html?v=gmod")
            const relativePath = window.location.pathname.split('/').pop() + window.location.search;
            
            // Cria o novo hash que será colocado na URL do Neocities
            const newHash = '#' + relativePath;

            // Atualiza a URL do site "pai" (Neocities) sem recarregar a página
            if (window.top.location.hash !== newHash) {
                window.top.location.hash = newHash;
            }
        } catch (e) {
            // Ignora erros de segurança que podem acontecer em alguns navegadores
            console.error("Não foi possível acessar a janela pai:", e);
        }
    }
}

// Executa a função assim que a página terminar de carregar
document.addEventListener('DOMContentLoaded', updateParentHash);
