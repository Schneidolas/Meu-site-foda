document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v');
    const videoData = youtubo_db.videos[videoId];

    if (!videoData) { return; }

    // --- ELEMENTOS DO DOM ---
    const videoContainer = document.getElementById('video-container-2007');
    const videoPlayer = document.getElementById('video-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const timeDisplay = document.getElementById('time-display');
    const progressBar = document.getElementById('progress-bar');
    const progressFilled = document.getElementById('progress-filled');
    const qualityBtn = document.getElementById('quality-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    // --- INICIALIZAR PLAYER ---
    videoPlayer.src = videoData.url;
    document.title = `${videoData.title} - YouTubo`;
    document.getElementById('video-title').textContent = videoData.title;
    document.getElementById('video-description').textContent = videoData.description;
    const channelLink = document.getElementById('channel-link');
    channelLink.textContent = videoData.channelId;
    channelLink.href = `userPage.html?id=${videoData.channelId}`;

    // --- LÓGICA DO PLAYER (PLAY, PAUSE, PROGRESSO) ---
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

    // --- 5. LÓGICA PARA NOVOS CONTROLES ---
    // VOLUME
    const handleVolume = () => {
        videoPlayer.volume = volumeSlider.value;
        if (videoPlayer.volume > 0.5) volumeBtn.textContent = '🔊';
        else if (videoPlayer.volume > 0) volumeBtn.textContent = '🔉';
        else volumeBtn.textContent = '🔇';
    };
    volumeBtn.addEventListener('click', () => {
        videoPlayer.muted = !videoPlayer.muted;
        volumeBtn.textContent = videoPlayer.muted ? '🔇' : '🔊';
    });
    volumeSlider.addEventListener('input', handleVolume);

    // QUALIDADE (COSMÉTICO)
    qualityBtn.addEventListener('click', () => {
        const isActive = qualityBtn.classList.toggle('active');
        qualityBtn.textContent = isActive ? 'HD' : 'SD';
        videoPlayer.classList.toggle('video-player-hd', isActive);
    });

    // TELA CHEIA
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen().catch(err => alert(`Erro: ${err.message}`));
        } else {
            document.exitFullscreen();
        }
    });

    // --- 5. LÓGICA DE AVALIAÇÃO (ESTRELAS) ---
    const ratingKey = `youtubo_rating_${videoId}`;
    const updateStars = (rating) => {
        stars.forEach(star => {
            star.textContent = parseInt(star.dataset.value) <= rating ? '★' : '☆';
            star.style.color = parseInt(star.dataset.value) <= rating ? '#f9bf3b' : '#ccc';
        });
    };
    stars.forEach(star => star.addEventListener('click', () => {
        const rating = star.dataset.value;
        localStorage.setItem(ratingKey, rating);
        updateStars(rating);
    }));
    updateStars(localStorage.getItem(ratingKey) || 0);

    // --- 6. LÓGICA DE COMENTÁRIOS ---
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
    
    // --- 7. APLICAR ESTILO DO CANAL ---
    const channelData = youtubo_db.channels[videoData.channelId];
    if (channelData && channelData.style) {
        const style = channelData.style;
        document.getElementById('custom-channel-styles').innerHTML = `
            body { background: ${style.pageBg}; font-family: ${style.fontFamily}; }
            .module { background-color: ${style.windowColor}; border-color: ${style.borderColor}; color: ${style.textColor};
                ${style.windowBgImage ? `background-image: url('${style.windowBgImage}');` : ''}
                ${style.windowShadow ? 'box-shadow: 0 2px 5px rgba(0,0,0,0.1);' : ''} }
            #video-description-box a, .module-header h3 { color: ${style.linkColor}; }`;
    }
});
