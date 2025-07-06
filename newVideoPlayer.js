document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CARREGAR DADOS DO VÍDEO ---
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v');
    const videoData = youtubo_db.videos[videoId];
    if (!videoData) { return; }

    // --- 2. APLICAR ESTILO DO CANAL (AGORA COM PLAYER BAR) ---
    const channelData = youtubo_db.channels[videoData.channelId];
    if (channelData && channelData.style) {
        const style = channelData.style;
        const styleElement = document.getElementById('custom-channel-styles');
        
        // Define o estilo da barra do player separadamente
        let playerBarStyle = '';
        if (style.playerBarBg) {
            // Regras específicas para a barra customizada
            playerBarStyle = `
                #custom-controls {
                    background: ${style.playerBarBg};
                }
                #custom-controls button {
                    background: transparent;
                    border: none;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                    color: #fff;
                }
            `;
        }

        if (styleElement) {
             styleElement.innerHTML = `
                body { background: ${style.pageBg || '#f1f1f1'}; font-family: ${style.fontFamily || 'Tahoma'}; }
                .module {
                    background-color: ${style.windowColor || '#fff'}; border-color: ${style.borderColor || '#ccc'};
                    color: ${style.textColor || '#000'}; background-size: cover; background-position: center;
                    ${style.windowBgImage ? `background-image: url('${style.windowBgImage}');` : ''}
                    ${style.windowShadow ? 'box-shadow: 0 2px 5px rgba(0,0,0,0.1);' : ''}
                }
                #video-description-box a, .module-header h3, .comment-user { color: ${style.linkColor || '#0055aa'}; }
                ${playerBarStyle}
             `;
        }
    }

    // --- 3. INICIALIZAR PLAYER E INFORMAÇÕES DA PÁGINA ---

    // --- CORREÇÃO PRINCIPAL AQUI ---
    // Verifica se o vídeo tem múltiplas qualidades ou apenas uma URL
    const hasMultipleQualities = typeof videoData.url === 'object' && videoData.url !== null;
    if (hasMultipleQualities) {
        videoPlayer.src = videoData.url.SD || videoData.url.HD; // Carrega SD por padrão, ou HD se for a única
        qualityBtn.disabled = !videoData.url.SD || !videoData.url.HD; // Desabilita se não tiver as duas opções
    } else {
        videoPlayer.src = videoData.url; // Carrega a URL simples
        qualityBtn.disabled = true; // Desabilita o botão
    }

    document.title = `${videoData.title} - YouTubo`;
    document.getElementById('video-title').textContent = videoData.title;
    document.getElementById('video-description').textContent = videoData.description;
    const channelLink = document.getElementById('channel-link');
    channelLink.textContent = videoData.channelId;
    channelLink.href = `userPage.html?id=${videoData.channelId}`;

    // --- 4. APLICAR ESTILO DO CANAL ---
    const channelData = youtubo_db.channels[videoData.channelId];
    if (channelData && channelData.style) {
        const style = channelData.style;
        const styleElement = document.getElementById('custom-channel-styles');
        if (styleElement) {
             styleElement.innerHTML = `
                body { background: ${style.pageBg || '#f1f1f1'}; font-family: ${style.fontFamily || 'Tahoma'}; }
                .module { background-color: ${style.windowColor || '#fff'}; border-color: ${style.borderColor || '#ccc'}; color: ${style.textColor || '#000'};
                    ${style.windowBgImage ? `background-image: url('${style.windowBgImage}');` : ''}
                    ${style.windowShadow ? 'box-shadow: 0 2px 5px rgba(0,0,0,0.1);' : ''} }
                #video-description-box a, .module-header h3, .comment-user { color: ${style.linkColor || '#0055aa'}; }`;
        }
    }

    // --- 5. LÓGICA FUNCIONAL DOS CONTROLES ---

    const togglePlay = () => { videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause(); };
    videoPlayer.addEventListener('play', () => { playPauseBtn.textContent = '❚❚'; });
    videoPlayer.addEventListener('pause', () => { playPauseBtn.textContent = '▶'; });
    playPauseBtn.addEventListener('click', togglePlay);
    videoPlayer.addEventListener('click', togglePlay);

    videoPlayer.addEventListener('timeupdate', () => {
        progressFilled.style.width = `${(videoPlayer.currentTime / videoPlayer.duration) * 100}%`;
        const formatTime = t => isNaN(t) ? '00:00' : `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
        timeDisplay.textContent = `${formatTime(videoPlayer.currentTime)} / ${formatTime(videoPlayer.duration)}`;
    });
    progressBar.addEventListener('click', (e) => {
        videoPlayer.currentTime = (e.offsetX / progressBar.offsetWidth) * videoPlayer.duration;
    });

    const handleVolume = () => {
        videoPlayer.volume = volumeSlider.value;
        videoPlayer.muted = volumeSlider.value == 0;
        if (videoPlayer.muted) volumeBtn.textContent = '🔇';
        else if (volumeSlider.value > 0.5) volumeBtn.textContent = '🔊';
        else volumeBtn.textContent = '🔉';
    };
    volumeBtn.addEventListener('click', () => {
        videoPlayer.muted = !videoPlayer.muted;
        volumeSlider.value = videoPlayer.muted ? 0 : videoPlayer.volume;
        handleVolume();
    });
    volumeSlider.addEventListener('input', handleVolume);
    handleVolume();

    qualityBtn.addEventListener('click', () => {
        if (qualityBtn.disabled || !hasMultipleQualities) return;
        const currentTime = videoPlayer.currentTime;
        const wasPaused = videoPlayer.paused;
        const isHD = !qualityBtn.classList.contains('active');

        qualityBtn.classList.toggle('active', isHD);
        qualityBtn.textContent = isHD ? 'HD' : 'SD';
        videoPlayer.src = isHD ? videoData.url.HD : videoData.url.SD;
        
        videoPlayer.addEventListener('loadeddata', () => {
            videoPlayer.currentTime = currentTime;
            if (!wasPaused) videoPlayer.play();
        }, { once: true });
    });

    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) { videoContainer.requestFullscreen(); }
        else { document.exitFullscreen(); }
    });

    // --- 6. LÓGICA DE AVALIAÇÃO (ESTRELAS) ---
    const ratingKey = `youtubo_rating_${videoId}`;
    const updateStars = (rating) => {
        stars.forEach(star => {
            const value = parseInt(star.dataset.value);
            star.textContent = value <= rating ? '★' : '☆';
            star.style.color = value <= rating ? '#f9bf3b' : '#ccc';
        });
    };
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.value);
            localStorage.setItem(ratingKey, rating);
            updateStars(rating);
        });
    });
    updateStars(parseInt(localStorage.getItem(ratingKey) || 0));

    // --- 7. LÓGICA DE COMENTÁRIOS ---
    const commentsKey = `youtubo_comments_${videoId}`;
    const renderComment = (comment) => {
        const el = document.createElement('div');
        el.className = 'comment-post';
        el.innerHTML = `<p><a href="#" class="comment-user">${comment.user}</a> <span class="comment-time">(${comment.time})</span></p><p>${comment.text}</p>`;
        commentList.prepend(el);
    };
    const loadComments = () => {
        const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
        commentList.innerHTML = '';
        comments.forEach(renderComment);
    };
    postBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (!text) return;
        const newComment = { user: 'Visitante', text: text, time: 'agora' };
        const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
        comments.push(newComment);
        localStorage.setItem(commentsKey, JSON.stringify(comments));
        renderComment(newComment);
        commentInput.value = '';
    });
    loadComments();
});
