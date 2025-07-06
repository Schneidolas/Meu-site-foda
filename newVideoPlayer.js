document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CARREGAR DADOS BÁSICOS ---
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v');
    const videoData = youtubo_db.videos[videoId];

    if (!videoData) {
        document.body.innerHTML = '<h1>Erro: Vídeo não encontrado.</h1>';
        return;
    }
    
    // --- 2. ELEMENTOS DO DOM ---
    const videoPlayer = document.getElementById('video-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressFilled = document.getElementById('progress-filled');
    const timeDisplay = document.getElementById('time-display');
    const stars = document.querySelectorAll('#ratings-container .star');
    const commentInput = document.getElementById('comment-input');
    const postBtn = document.getElementById('post-comment-btn');
    const commentList = document.getElementById('comment-list');
    
    // --- 3. INICIALIZAR PLAYER E INFORMAÇÕES ---
    videoPlayer.src = videoData.url;
    document.title = `${videoData.title} - YouTubo`;
    document.getElementById('video-title').textContent = videoData.title;
    document.getElementById('video-description').textContent = videoData.description;
    const channelLink = document.getElementById('channel-link');
    channelLink.textContent = videoData.channelId;
    channelLink.href = `userPage.html?id=${videoData.channelId}`;

    // --- 4. LÓGICA DO PLAYER (PLAY, PAUSE, PROGRESSO) ---
    const togglePlay = () => { videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause(); };
    videoPlayer.addEventListener('play', () => { playPauseBtn.textContent = '❚❚'; });
    videoPlayer.addEventListener('pause', () => { playPauseBtn.textContent = '▶'; });
    playPauseBtn.addEventListener('click', togglePlay);
    videoPlayer.addEventListener('click', togglePlay);

    videoPlayer.addEventListener('timeupdate', () => {
        const progressPercent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progressFilled.style.width = `${progressPercent}%`;
        const formatTime = t => isNaN(t) ? '00:00' : `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
        timeDisplay.textContent = `${formatTime(videoPlayer.currentTime)} / ${formatTime(videoPlayer.duration)}`;
    });
    document.getElementById('progress-bar').addEventListener('click', (e) => {
        videoPlayer.currentTime = (e.offsetX / e.currentTarget.offsetWidth) * videoPlayer.duration;
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
