document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DEFINIÇÃO DE TODOS OS ELEMENTOS DO DOM ---
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
    const stars = document.querySelectorAll('#ratings-container .star');
    const commentInput = document.getElementById('comment-input');
    const postBtn = document.getElementById('post-comment-btn');
    const commentList = document.getElementById('comment-list');

    // --- 2. CARREGAR DADOS DO VÍDEO ---
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v');
    const videoData = youtubo_db.videos[videoId];
    if (!videoData) {
        document.body.innerHTML = '<h1>Erro: Vídeo não encontrado.</h1>';
        return;
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

    const sidebar = document.getElementById('sidebar-column');
    const allVideoIds = Object.keys(youtubo_db.videos);
    const currentVideoIndex = allVideoIds.indexOf(videoId);
    
    // Remove o vídeo atual da lista de recomendações
    if (currentVideoIndex > -1) {
        allVideoIds.splice(currentVideoIndex, 1);
    }
    
    // Embaralha e pega alguns vídeos para recomendar
    const recommendedVideos = allVideoIds.sort(() => 0.5 - Math.random()).slice(0, 5); // Recomenda até 5 vídeos
    
    recommendedVideos.forEach(recVideoId => {
        const recVideoData = youtubo_db.videos[recVideoId];
        const item = document.createElement('div');
        item.className = 'recommended-video-item';
        item.innerHTML = `
            <a href="videoPlayer.html?v=${recVideoData.id}">
                <img src="${recVideoData.thumbnail}" alt="${recVideoData.title}">
            </a>
            <div class="recommended-video-info">
                <a href="videoPlayer.html?v=${recVideoData.id}">${recVideoData.title}</a>
                <span>by ${recVideoData.channelId}</span>
            </div>
        `;
        sidebar.appendChild(item);
    });

    // --- LÓGICA PARA TELA FINAL ---
    const endScreen = document.getElementById('end-screen');
    
    videoPlayer.addEventListener('ended', () => {
        endScreen.innerHTML = ''; // Limpa a tela final
        endScreen.style.display = 'flex';
    
        // Pega 2 vídeos recomendados para mostrar na tela final
        const endScreenVideos = allVideoIds.sort(() => 0.5 - Math.random()).slice(0, 4); 
    
        endScreenVideos.forEach(recVideoId => {
            const recVideoData = youtubo_db.videos[recVideoId];
            const item = document.createElement('a'); // Agora é um link direto
            item.href = `videoPlayer.html?v=${recVideoData.id}`;
            item.className = 'end-screen-video';
            item.innerHTML = `
                <img src="${recVideoData.thumbnail}" alt="${recVideoData.title}">
                <div class="overlay">${recVideoData.title}</div>
            `;
            endScreen.appendChild(item);
        });
    });
    
    // Esconde a tela final se o usuário tocar o vídeo de novo
    videoPlayer.addEventListener('play', () => {
        endScreen.style.display = 'none';
    });

    // --- 4. APLICAR ESTILO DO CANAL ---
     const channelData = youtubo_db.channels[videoData.channelId];
    if (channelData && channelData.style) {
        const style = channelData.style;
        const styleElement = document.getElementById('custom-channel-styles');
        if (styleElement) {
             styleElement.innerHTML = `
                body { background: ${style.pageBg || '#f1f1f1'}; font-family: ${style.fontFamily || 'Tahoma'}; }
                
                /* Estilos dos módulos (com background-size: cover;) */
                .module { 
                    background-color: ${style.windowColor || '#fff'}; 
                    border-color: ${style.borderColor || '#ccc'}; 
                    color: ${style.textColor || '#000'};
                    ${style.windowBgImage ? `background-image: url('${style.windowBgImage}'); background-size: cover; background-repeat: no-repeat;` : ''}
                    ${style.windowShadow ? 'box-shadow: 0 2px 5px rgba(0,0,0,0.1);' : ''} 
                }
                
                #video-description-box a, .module-header h3, .comment-user { color: ${style.linkColor || '#0055aa'}; }
                
                /* NOVO: Estilo customizado para a barra do player! */
                #custom-controls {
                    background: ${style.playerBarBg || 'linear-gradient(to bottom, #4a4a4a, #2b2b2b)'};
                }
             `;
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

// --- LÓGICA PARA ANOTAÇÕES ---
const annotationsLayer = document.getElementById('annotations-layer');

// Mini banco de dados de anotações (você pode mover para o database.js se preferir)
const annotations_db = {
    
};

const videoAnnotations = annotations_db[videoId] || [];

videoPlayer.addEventListener('timeupdate', () => {
    const currentTime = videoPlayer.currentTime;

    // --- LÓGICA DAS ANOTAÇÕES (CORRIGIDA) ---
    videoAnnotations.forEach((ann, index) => {
        const annId = `annotation-${index}`;
        const existingAnn = document.getElementById(annId);

        // Condição para mostrar a anotação
        const shouldBeVisible = currentTime >= ann.startTime && currentTime <= ann.endTime;

        if (shouldBeVisible && !existingAnn) {
            // Cria a anotação se ela deve estar visível e não existe
            const annEl = document.createElement('div');
            annEl.id = annId;
            annEl.className = 'annotation-box';
            annEl.style.top = ann.top;
            annEl.style.left = ann.left;
            annEl.innerHTML = `${ann.text}<div class="annotation-close-btn">x</div>`;
            annotationsLayer.appendChild(annEl);
            annEl.querySelector('.annotation-close-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                annEl.remove();
            });
        } else if (!shouldBeVisible && existingAnn) {
            // Remove a anotação se ela não deve estar visível e existe
            existingAnn.remove();
        }
    });

    progressFilled.style.width = `${(currentTime / videoPlayer.duration) * 100}%`;
    const formatTime = t => isNaN(t) ? '00:00' : `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
    timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(videoPlayer.duration)}`;
});

// --- LÓGICA DO BOTÃO SHARE ---
const shareBtn = document.querySelector('#action-bar .action-button'); // Assume que o "Share" é o primeiro botão
const shareModal = document.getElementById('share-modal');
const closeModalBtn = document.querySelector('.modal-close-btn');
const shareLinkInput = document.getElementById('share-link-input');
const copyLinkBtn = document.getElementById('copy-link-btn');

// Abre a janela modal
shareBtn.addEventListener('click', () => {
    // Pega a URL atual, mas usa a URL do site pai (Neocities)
    const videoUrl = window.top.location.href;
    shareLinkInput.value = videoUrl;
    shareModal.style.display = 'flex';
});

// Fecha a janela modal
const closeModal = () => {
    shareModal.style.display = 'none';
};

closeModalBtn.addEventListener('click', closeModal);
shareModal.addEventListener('click', (e) => {
    // Fecha se clicar no fundo escuro, mas não se clicar no conteúdo
    if (e.target === shareModal) {
        closeModal();
    }
});

// Copia o link para a área de transferência
copyLinkBtn.addEventListener('click', () => {
    shareLinkInput.select();
    try {
        document.execCommand('copy');
        copyLinkBtn.textContent = 'Copiado!';
        setTimeout(() => {
            copyLinkBtn.textContent = 'Copiar';
        }, 1500); // Volta ao normal depois de 1.5s
    } catch (err) {
        alert('Não foi possível copiar o link.');
    }
});
