// userPage.js - O CONSTRUTOR DE PÁGINAS

document.addEventListener('DOMContentLoaded', () => {
    // --- SETUP INICIAL ---
    const params = new URLSearchParams(window.location.search);
    const channelId = params.get('id');
    const channelData = youtubo_db.channels[channelId];
    if (!channelData) { /* ... código de erro ... */ return; }
    
    const wrapper = document.getElementById('content-wrapper');
    wrapper.innerHTML = ''; // Limpa a página para construir do zero

    // --- FUNÇÕES GERADORAS DE CONTEÚDO ---
    const generateAllVideos = () => {
        const videos = Object.values(youtubo_db.videos).filter(v => v.channelId === channelId);
        if (videos.length === 0) return '<p>Este canal ainda não tem vídeos.</p>';
        return `<div class="video-grid">${videos.map(v => `
            <div class="video-item">
                <a href="videoPlayer.html?v=${v.id}">
                    <img src="${v.thumbnail}" class="thumbnail"><b>${v.title}</b>
                </a>
            </div>`).join('')}</div>`;
    };
    
    const generatePlaylists = () => `<p>Playlists estarão disponíveis em breve!</p>`;
    
    const generateMyInfos = () => {
        const links = Object.entries(channelData.myInfos);
        if (links.length === 0) return '';
        return `<h3>Me encontre em:</h3><ul>${links.map(([name, url]) => `
            <li><a href="${url}" target="_blank">${name}</a></li>
        `).join('')}</ul>`;
    };

    // --- CONSTRUÇÃO DA PÁGINA ---
    // 1. Banner
    wrapper.innerHTML += `<div id="channel-banner" class="module"><img src="${channelData.banner}"></div>`;
    // 2. Caixa de Perfil
    wrapper.innerHTML += `
        <div id="profile-box" class="module">
            <img id="profile-pic" src="${channelData.profilePic}">
            <div class="profile-details">
                <div class="profile-header">
                    <h3 id="channel-name">${channelData.name}</h3>
                    <button id="subscribe-btn"></button>
                </div>
                <p id="channel-bio">${channelData.bio}</p>
                <div id="channel-stats">
                    <span id="sub-counter">${channelData.subscribers.toLocaleString('pt-BR')}</span> inscritos
                </div>
            </div>
        </div>`;

    // 3. Conteúdo Principal (Abas ou Seções)
    const contentModule = document.createElement('div');
    contentModule.className = 'module';
    let contentHTML = '';

    const categories = {
        'All Videos': generateAllVideos,
        'Playlists': generatePlaylists,
        'My Infos': generateMyInfos,
    };

    if (channelData.channelPage_Abas) {
        // MODO ABAS
        contentHTML += `<div class="tabs-nav">`;
        channelData.channelPage_Categories.forEach((catName, index) => {
            contentHTML += `<button class="tab-link ${index === 0 ? 'active' : ''}" data-tab="${catName.replace(' ', '')}">${catName}</button>`;
        });
        contentHTML += `</div>`;
        
        channelData.channelPage_Categories.forEach((catName, index) => {
            contentHTML += `<div class="tab-pane ${index === 0 ? 'active' : ''}" id="${catName.replace(' ', '')}">${categories[catName]()}</div>`;
        });
    } else {
        // MODO SEÇÕES
        channelData.channelPage_Categories.forEach(catName => {
            contentHTML += `
                <div class="module-header"><h3>${catName}</h3></div>
                <div class="module-content">${categories[catName]()}</div>`;
        });
    }
    contentModule.innerHTML = contentHTML;
    wrapper.appendChild(contentModule);

    // --- ADICIONAR ESTILOS E EVENTOS DINÂMICOS ---
    // Aplica o tipo de borda
    document.querySelectorAll('.module').forEach(el => el.classList.add(`border-${channelData.style.borderType || 'round'}`));
    
    // Lógica do botão de inscrição (igual anterior)
    const subBtn = document.getElementById('subscribe-btn');
    // ...
    
    // Lógica das abas, se existirem
    if (channelData.channelPage_Abas) {
        const tabLinks = document.querySelectorAll('.tab-link');
        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const tabId = link.dataset.tab;
                document.querySelectorAll('.tab-link, .tab-pane').forEach(el => el.classList.remove('active'));
                link.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // Aplica estilos customizados (igual anterior)
    // ...
});
