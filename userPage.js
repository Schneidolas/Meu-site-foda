// userPage.js (RECONSTRUÍDO DO ZERO)

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SETUP E VALIDAÇÃO ---
    const params = new URLSearchParams(window.location.search);
    const channelId = params.get('id');
    const channelData = youtubo_db.channels[channelId];
    if (!channelData) { document.body.innerHTML = '<h1>Canal não encontrado.</h1>'; return; }

    // --- 2. PREENCHER INFORMAÇÕES BÁSICAS (BANNER, PERFIL) ---
    document.title = `Canal de ${channelData.name}`;
    document.getElementById('channel-banner').innerHTML = `<img src="${channelData.banner}" alt="Banner">`;
    document.getElementById('profile-pic').src = channelData.profilePic;
    document.getElementById('channel-name').textContent = channelData.name;
    document.getElementById('channel-bio').textContent = channelData.bio;
    document.getElementById('sub-counter').textContent = channelData.subscribers.toLocaleString('pt-BR');

    // --- 3. CONSTRUIR O CONTEÚDO PRINCIPAL (VÍDEOS, INFOS, ETC.) ---
    const contentArea = document.getElementById('channel-content-area');
    const categoriesToShow = channelData.channelPage_Categories || ['All Videos'];

    // Funções que geram o HTML para cada tipo de seção
    const generators = {
        'All Videos': () => {
            const videos = Object.values(youtubo_db.videos).filter(v => v.channelId === channelId);
            if (videos.length === 0) return '<p>Este canal ainda não tem vídeos.</p>';
            return `<div class="video-grid">${videos.map(v => `...`).join('')}</div>`;
        },
        'Playlists': () => `<p>Playlists em breve!</p>`,
        'My Infos': () => {
            const links = Object.entries(channelData.myInfos || {});
            if (links.length === 0) return '<p>Nenhuma informação adicional.</p>';
            return `<ul>${links.map(([name, url]) => `<li><a href="${url}" ...>${name}</a></li>`).join('')}</ul>`;
        }
    };

    if (channelData.channelPage_Abas) {
        // MODO ABAS
        const tabsModule = document.createElement('div');
        tabsModule.className = 'module';
        let navHTML = '<div class="tabs-nav">';
        let panesHTML = '';
        categoriesToShow.forEach((catName, index) => {
            const tabId = catName.replace(/\s/g, '');
            navHTML += `<button class="tab-link ${index === 0 ? 'active' : ''}" data-tab="${tabId}">${catName}</button>`;
            panesHTML += `<div class="tab-pane ${index === 0 ? 'active' : ''}" id="${tabId}"><div class="section-content">${generators[catName]()}</div></div>`;
        });
        navHTML += '</div>';
        tabsModule.innerHTML = navHTML + panesHTML;
        contentArea.appendChild(tabsModule);

        // Adicionar eventos para as abas
        tabsModule.querySelectorAll('.tab-link').forEach(link => {
            link.addEventListener('click', () => { /* ... lógica de troca de aba ... */ });
        });

    } else {
        // MODO SEÇÕES
        categoriesToShow.forEach(catName => {
            const sectionModule = document.createElement('div');
            sectionModule.className = 'module';
            sectionModule.innerHTML = `
                <div class="section-header"><h3>${catName}</h3></div>
                <div class="section-content">${generators[catName]()}</div>
            `;
            contentArea.appendChild(sectionModule);
        });
    }
    
    // --- 4. APLICAR ESTILOS E EVENTOS FINAIS ---
    // (Lógica do botão de subscribe, estilos customizados, etc. - igual ao anterior, mas agora executa no final)
});
