// newVideoPlayer.js - VERSÃO CORRIGIDA E ROBUSTA

// Espera o DOM carregar para evitar erros
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CARREGAR DADOS DO VÍDEO ---
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v');
    const videoData = youtubo_db.videos[videoId];
    const videoPlayer = document.getElementById('video-player');
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v');
    const videoData = youtubo_db.videos[videoId];

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
    const ratingsContainer = document.getElementById('ratings-container');
    const stars = ratingsContainer.querySelectorAll('.star');
    const ratingKey = `youtubo_rating_${videoId}`;

    const updateStars = (rating) => {
        stars.forEach(star => {
            star.textContent = star.dataset.value <= rating ? '★' : '☆';
        });
    };

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.dataset.value;
            localStorage.setItem(ratingKey, rating);
            updateStars(rating);
        });
    });

    // Carrega a nota salva quando a página abre
    updateStars(localStorage.getItem(ratingKey) || 0);

    // --- NOVO: LÓGICA DE COMENTÁRIOS ---
    const commentInput = document.getElementById('comment-input');
    const postBtn = document.getElementById('post-comment-btn');
    const commentList = document.getElementById('comment-list');
    const commentsKey = `youtubo_comments_${videoId}`;

    const renderComment = (comment) => {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment-post';
        commentEl.innerHTML = `
            <p class="comment-user">Visitante <span class="comment-time">(${comment.time})</span></p>
            <p>${comment.text}</p>
        `;
        commentList.prepend(commentEl); // Adiciona o mais novo no topo
    };

    const loadComments = () => {
        const savedComments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
        commentList.innerHTML = '';
        savedComments.forEach(renderComment);
    };

    postBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (!text) return;

        const newComment = {
            text: text,
            time: new Date().toLocaleString('pt-BR')
        };

        const allComments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
        allComments.push(newComment);
        localStorage.setItem(commentsKey, JSON.stringify(allComments));
        
        renderComment(newComment);
        commentInput.value = '';
    });

    loadComments(); // Carrega os comentários salvos

    // --- NOVO: LÓGICA DA SIDEBAR DE RECOMENDAÇÕES ---
    const sidebarList = document.getElementById('sidebar-video-list');
    const allVideoIds = Object.keys(youtubo_db.videos);
    // Filtra para não mostrar o vídeo atual na sidebar
    const recommendedIds = allVideoIds.filter(id => id !== videoId);
    
    // Embaralha e pega os 5 primeiros
    recommendedIds.sort(() => 0.5 - Math.random());
    const videosToShow = recommendedIds.slice(0, 5);

    videosToShow.forEach(id => {
        const video = youtubo_db.videos[id];
        const videoEl = document.createElement('div');
        videoEl.className = 'sidebar-video-item';
        videoEl.innerHTML = `
            <a href="videoPlayer.html?v=${id}">
                <img src="${video.thumbnail}" class="sidebar-thumbnail">
                <div class="sidebar-video-title">${video.title}</div>
            </a>
        `;
        sidebarList.appendChild(videoEl);
    });

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
