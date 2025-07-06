// newVideoPlayer.js - VERSÃO CORRIGIDA E ROBUSTA

// Espera o DOM carregar para evitar erros
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CARREGAR DADOS DO VÍDEO ---
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v');
    const videoData = youtubo_db.videos[videoId];
    const videoPlayer = document.getElementById('video-player');

    if (!videoData || !videoPlayer) {
        document.body.innerHTML = '<h1>Erro 404: Vídeo não encontrado ou player quebrado.</h1><a href="index.html">Voltar para a home</a>';
        return;
    }

    // Carrega a URL e informações básicas
    videoPlayer.src = videoData.url;
    document.title = `${videoData.title} - YouTubo`;
    document.getElementById('video-title').textContent = videoData.title;
    document.getElementById('video-description').textContent = videoData.description;

    const channelLink = document.getElementById('channel-link');
    channelLink.textContent = videoData.channelId;
    channelLink.href = `userPage.html?id=${videoData.channelId}`;

    // --- 2. LÓGICA DO PLAYER (SIMPLIFICADA E CORRIGIDA) ---
    const playPauseBtn = document.getElementById('play-pause-btn');

    // A função principal de tocar/pausar
    const togglePlay = () => {
        if (videoPlayer.paused || videoPlayer.ended) {
            videoPlayer.play().catch(error => {
                console.error("Erro ao tentar tocar o vídeo:", error);
                // Isso pode acontecer se o usuário não interagiu com a página ainda.
            });
        } else {
            videoPlayer.pause();
        }
    };

    // Atualiza o ícone do botão
    videoPlayer.addEventListener('play', () => {
        playPauseBtn.textContent = '❚❚';
    });
    videoPlayer.addEventListener('pause', () => {
        playPauseBtn.textContent = '▶';
    });

    // Conecta a função togglePlay aos eventos
    playPauseBtn.addEventListener('click', togglePlay); // Clique no botão
    videoPlayer.addEventListener('click', togglePlay);  // Clique no vídeo

    // Tocar com a barra de espaço
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault(); // Evita que a página role para baixo
            togglePlay();
        }
    });

    // O resto da lógica (barra de progresso, volume, etc.)
    const progressBar = document.getElementById('progress-bar');
    const progressFilled = document.getElementById('progress-filled');
    const timeDisplay = document.getElementById('time-display');

    videoPlayer.addEventListener('timeupdate', () => {
        const progressPercent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progressFilled.style.width = `${progressPercent}%`;

        const formatTime = t => {
            if (isNaN(t)) return '00:00';
            const m = Math.floor(t / 60);
            const s = Math.floor(t % 60);
            return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        };
        timeDisplay.textContent = `${formatTime(videoPlayer.currentTime)} / ${formatTime(videoPlayer.duration)}`;
    });

    videoPlayer.addEventListener('loadedmetadata', () => {
        // Atualiza a duração total assim que o vídeo carregar os metadados
        timeDisplay.textContent = `00:00 / ${Math.floor(videoPlayer.duration / 60)}:${String(Math.floor(videoPlayer.duration % 60)).padStart(2, '0')}`;
    });

    progressBar.addEventListener('click', (e) => {
        const scrubTime = (e.offsetX / progressBar.offsetWidth) * videoPlayer.duration;
        videoPlayer.currentTime = scrubTime;
    });

    // --- (OPCIONAL, MAS RECOMENDADO) CARREGAR ESTILOS E COMENTÁRIOS DEPOIS ---
    // Isso garante que o player seja a prioridade
    const channelData = youtubo_db.channels[videoData.channelId];
    if (channelData && channelData.style) {
        const style = channelData.style;
        let customCSS = `
            body { background: ${style.pageBg}; font-family: ${style.fontFamily}; }
            .module {
                background-color: ${style.windowColor}; border-color: ${style.borderColor}; color: ${style.textColor};
                ${style.windowBgImage ? `background-image: url('${style.windowBgImage}');` : ''}
                ${style.windowShadow ? 'box-shadow: 0 2px 5px rgba(0,0,0,0.1);' : ''}
            }
            #video-description-box a, .module-header h3 { color: ${style.linkColor}; }
        `;
        document.getElementById('custom-channel-styles').innerHTML = customCSS;
    }
});
