// Aguarda a página carregar completamente
window.onload = function() {
    // Objeto com os IDs dos vídeos e suas respectivas URLs
    // ***** MUDE AS URLS AQUI para os seus vídeos do GitHub! *****
    const videos = {
        'gmod': {
            'url': 'https://archive.org/download/C.E.Animation.Test/C.E.Animation.Test.mp4', // Exemplo
            'title': "review de garry's mod"
        },
        'smosh': {
            'url': 'https://archive.org/download/PokemonInRealLifeunofficialVideo/Pokemon%20in%20Real%20Life%20%28unofficial%20video%29.mp4', // Exemplo
            'title': 'POKEMON NA VIDA REAL!!'
        },
        'spongebob': {
            'url': 'https://ia803201.us.archive.org/17/items/spongebob-rip-pants-song/Spongebob%20Rip%20Pants%20Song.mp4', // Exemplo
            'title': 'spongebob cantando rock'
        },
        'equals_three': {
            'url': 'https://archive.org/download/fail-compilation-2012/Fail%20Compilation%202012.mp4', // Exemplo
            'title': 'VIDEOS ENGRAÇADOS DA SEMANA'
        },
        'youtuber': {
            'url': 'https://ia600508.us.archive.org/21/items/CreativeCommonsVideo/CreativeCommonsVideo.mp4', // Exemplo
            'title': 'meus youtubers favoritos ^_^'
        }
        // Adicione mais vídeos aqui conforme precisar
    };

    // Pega os parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('video'); // Pega o valor de "?video="

    const videoPlayer = document.getElementById('video-player');
    const videoTitle = document.getElementById('video-title');

    // Verifica se o videoId existe no nosso objeto de vídeos
    if (videoId && videos[videoId]) {
        // Atualiza o src do player de vídeo
        videoPlayer.src = videos[videoId].url;
        // Atualiza o título na página
        videoTitle.textContent = videos[videoId].title;
    } else {
        // Se o vídeo não for encontrado, mostra uma mensagem de erro
        videoTitle.textContent = "Oops! Vídeo não encontrado. :(";
        videoTitle.style.color = "red";
    }
};