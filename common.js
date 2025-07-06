// common.js - Versão 2.0

function updateParentHash() {
    // Só roda se estiver dentro de um iframe
    if (window.self !== window.top) {
        try {
            // Pega o nome do arquivo atual e os parâmetros da URL
            const pageName = window.location.pathname.split('/').pop();
            const searchParams = window.location.search;
            const relativePath = pageName + searchParams;

            // O novo hash a ser definido na URL pai (Neocities)
            const newHash = '#' + relativePath;

            // Atualiza o hash da janela pai (Neocities)
            // Usamos replaceState para garantir que a mudança seja registrada
            if (window.top.location.hash !== newHash) {
                 window.top.history.replaceState(null, null, ' ' + newHash); // O espaço é um truque para forçar a atualização em alguns navegadores
            }

        } catch (e) {
            console.error("Erro ao tentar atualizar a URL pai:", e);
        }
    }
}

// Roda assim que o DOM carregar
document.addEventListener('DOMContentLoaded', updateParentHash);
