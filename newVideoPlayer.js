document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v');
    const videoData = youtubo_db.videos[videoId];
    const videoPlayer = document.getElementById('video-player');

    if (!videoData || !videoPlayer) {
        document.body.innerHTML = '<h1>Erro: Vídeo não encontrado.</h1>';
        return;
    }
    videoPlayer.src = videoData.url;
    document.title = `${videoData.title} - YouTubo`;
    document.getElementById('video-title').textContent = videoData.title;
    document.getElementById('video-description').textContent = videoData.description;
    const channelLink = document.getElementById('channel-link');
    channelLink.textContent = videoData.channelId;
    channelLink.href = `userPage.html?id=${videoData.channelId}`;

    const playPauseBtn = document.getElementById('play-pause-btn');
    const togglePlay = () => {
        if (videoPlayer.paused || videoPlayer.ended) {
            videoPlayer.play().catch(error => console.error("Erro ao tocar:", error));
        } else {
            videoPlayer.pause();
        }
    };

    videoPlayer.addEventListener('play', () => { playPauseBtn.textContent = '❚❚'; });
    videoPlayer.addEventListener('pause', () => { playPauseBtn.textContent = '▶'; });
    playPauseBtn.addEventListener('click', togglePlay);
    videoPlayer.addEventListener('click', togglePlay);

    const progressBar = document.getElementById('progress-bar');
    const progressFilled = document.getElementById('progress-filled');
    const timeDisplay = document.getElementById('time-display');

    videoPlayer.addEventListener('timeupdate', () => {
        const progressPercent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progressFilled.style.width = `${progressPercent}%`;
        const formatTime = t => {
            if (isNaN(t)) return '00:00';
            const m = Math.floor(t / 60); const s = Math.floor(t % 60);
            return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        };
        timeDisplay.textContent = `${formatTime(videoPlayer.currentTime)} / ${formatTime(videoPlayer.duration)}`;
    });

    progressBar.addEventListener('click', (e) => {
        videoPlayer.currentTime = (e.offsetX / progressBar.offsetWidth) * videoPlayer.duration;
    });

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
