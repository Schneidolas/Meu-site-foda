document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const channelId = params.get('id');
    const channelData = youtubo_db.channels[channelId];

    if (!channelData) { document.body.innerHTML = `<h1>Canal não encontrado.</h1>`; return; }

    document.title = `Canal de ${channelData.name}`;
    document.getElementById('channel-banner').innerHTML = `<img src="${channelData.banner}" alt="Banner">`;
    document.getElementById('profile-pic').src = channelData.profilePic;
    document.getElementById('channel-name').textContent = channelData.name;
    document.getElementById('channel-bio').textContent = channelData.bio;
    document.getElementById('sub-counter').textContent = channelData.subscribers.toLocaleString('pt-BR');

    const subBtn = document.getElementById('subscribe-btn');
    const subKey = `youtubo_subscribed_${channelId}`;

    const updateSubButton = () => {
        if (localStorage.getItem(subKey) === 'true') {
            subBtn.classList.add('subscribed');
            subBtn.textContent = 'Subscribed';
        } else {
            subBtn.classList.remove('subscribed');
            subBtn.textContent = 'Subscribe';
        }
    };
    subBtn.addEventListener('click', () => {
        if (subBtn.classList.contains('subscribed')) { localStorage.removeItem(subKey); }
        else { localStorage.setItem(subKey, 'true'); }
        updateSubButton();
    });
    updateSubButton();

    const style = channelData.style;
    iconst style = channelData.style;
    if (style) {
        let customCSS = `
            body { background: ${style.pageBg}; font-family: ${style.fontFamily}; }
            .module {
                background-color: ${style.windowColor};
                border-color: ${style.borderColor};
                color: ${style.textColor};
                
                /* CORREÇÃO AQUI: background-size: cover; para esticar a imagem */
                ${style.windowBgImage ? `background-image: url('${style.windowBgImage}'); background-size: cover; background-repeat: no-repeat;` : ''}
                
                ${style.windowShadow ? 'box-shadow: 0 4px 10px rgba(0,0,0,0.15);' : ''}
            }
            .module a, .module-header h3, #videos-header { color: ${style.linkColor}; }
            
            /* (Estilo de brilho windowGloss continua igual) */
        `;
        document.getElementById('custom-channel-styles').innerHTML = customCSS;
    }

    const videoGrid = document.getElementById('video-grid');
    const channelVideos = Object.values(youtubo_db.videos).filter(v => v.channelId === channelId);
    if (channelVideos.length > 0) {
        channelVideos.forEach(video => {
            const videoElement = document.createElement('div');
            videoElement.className = 'video-item';
            videoElement.innerHTML = `<a href="videoPlayer.html?v=${video.id}"><img src="${video.thumbnail}" class="thumbnail"><b>${video.title}</b></a>`;
            videoGrid.appendChild(videoElement);
        });
    } else { videoGrid.innerHTML = '<p>Este canal ainda não postou vídeos.</p>'; }
});
