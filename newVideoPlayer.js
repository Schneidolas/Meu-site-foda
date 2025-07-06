document.addEventListener('DOMContentLoaded', () => {
    // 1. PEGAR DADOS DO VÍDEO
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v');
    const videoData = youtubo_db.videos[videoId];

    if (!videoId || !videoData) {
        document.body.innerHTML = '<h1>Erro 404: Vídeo não encontrado!</h1><a href="MainPage.html">Voltar para a home</a>';
        return;
    }

    // A MÁGICA: PEGAR OS DADOS DO CANAL DO VÍDEO
    const channelId = videoData.channelId;
    const channelData = youtubo_db.channels[channelId];

    // 2. APLICAR ESTILO DO CANAL NA PÁGINA DO VÍDEO
    if (channelData && channelData.style) {
        const style = channelData.style;
        let customCSS = `
            body {
                background: ${style.pageBg || '#e1e1e1'};
                font-family: ${style.fontFamily || "'Tahoma', sans-serif"};
            }
            .module {
                background-color: ${style.windowColor || '#fff'};
                border: 1px solid ${style.borderColor || '#ccc'};
                color: ${style.textColor || '#000'};
                ${style.windowBgImage ? `background-image: url('${style.windowBgImage}');` : ''}
                ${style.windowShadow ? 'box-shadow: 0 2px 5px rgba(0,0,0,0.1);' : ''}
            }
            #video-description-box a, #comments-module .comment-user, #comments-module .module-header h3 {
                color: ${style.linkColor || '#0055aa'};
            }
            ${style.windowGloss ? `.module::before {
                content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 50%;
                background: linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0));
                pointer-events: none;
            }` : ''}
        `;
        document.getElementById('custom-channel-styles').innerHTML = customCSS;
    }
    
    // --- O RESTO DO SCRIPT CONTINUA IGUAL ---

    // 3. ELEMENTOS DO DOM
    const videoPlayer = document.getElementById('video-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    // ... (restante das declarações de elementos)
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const channelLink = document.getElementById('channel-link');

    // 4. CARREGAR INFORMAÇÕES DO VÍDEO
    videoPlayer.src = videoData.url;
    videoTitle.textContent = videoData.title;
    videoDescription.textContent = videoData.description;
    channelLink.textContent = videoData.channelId;
    channelLink.href = `userPage.html?id=${videoData.channelId}`;
    document.title = `${videoData.title} - YouTubo`;

    // 5. LÓGICA DO PLAYER (SEM ALTERAÇÕES)
    // ... (toda a lógica de play/pause, progresso, volume, etc., permanece aqui)
    const togglePlay = () => { videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause(); };
    videoPlayer.addEventListener('play', () => playPauseBtn.textContent = '❚❚');
    videoPlayer.addEventListener('pause', () => playPauseBtn.textContent = '▶');
    
    const updateProgress = () => {
        const progressPercent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        document.getElementById('progress-filled').style.width = `${progressPercent}%`;
        const formatTime = t => {
            const m = Math.floor(t / 60);
            const s = Math.floor(t % 60);
            return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        };
        document.getElementById('time-display').textContent = `${formatTime(videoPlayer.currentTime)} / ${formatTime(videoPlayer.duration || 0)}`;
    };
    
    // ... O resto da lógica do player, ratings e comentários continua aqui, sem alterações.
    // Colei apenas uma parte para demonstrar onde fica, mas o resto do seu script original
    // a partir deste ponto pode ser mantido.
});