// mainLogic.js - VERSÃO FINAL, CORRIGIDA E COMPLETA

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS GLOBAIS ---
    const dynamicContent = document.getElementById('dynamic-content');
    const navLinks = document.querySelectorAll('#nav-bar a');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    let currentUser = localStorage.getItem('youtubo_user');

    // --- FUNÇÕES DE RENDERIZAÇÃO DE PÁGINAS ---
    const renderers = {
        home: () => {
            const template = document.getElementById('template-home').content.cloneNode(true);
            const videoGrid = template.getElementById('video-grid');
            // Mostra os 4 primeiros vídeos como "Featured"
            Object.values(youtubo_db.videos).slice(0, 4).forEach(video => {
                renderVideoItem(video, videoGrid, 'list');
            });
            setupLoginModule(template.getElementById('login-module'));
            dynamicContent.innerHTML = '';
            dynamicContent.appendChild(template);
        },
        videos: () => {
            const template = document.getElementById('template-videos').content.cloneNode(true);
            const videoGrid = template.getElementById('video-grid-full');
            // Mostra TODOS os vídeos em formato de grade
            Object.values(youtubo_db.videos).forEach(video => {
                renderVideoItem(video, videoGrid, 'grid');
            });
            dynamicContent.innerHTML = '';
            dynamicContent.appendChild(template);
        },
        channels: () => {
            const template = document.getElementById('template-channels').content.cloneNode(true);
            const channelList = template.getElementById('channel-list');
            Object.values(youtubo_db.channels).forEach(channel => {
                const item = document.createElement('div');
                item.className = 'channel-item';
                item.innerHTML = `
                    <a href="userPage.html?id=${channel.name}"><img src="${channel.profilePic}" class="channel-pic"></a>
                    <div class="channel-info">
                        <h4><a href="userPage.html?id=${channel.name}">${channel.name}</a></h4>
                        <span>${channel.subscribers.toLocaleString()} subscribers</span>
                    </div>
                    <button class="subscribe-btn" data-channel-id="${channel.name}">Subscribe</button>`;
                channelList.appendChild(item);
            });
            setupSubscribeButtons(channelList);
            dynamicContent.innerHTML = '';
            dynamicContent.appendChild(template);
        },
        community: () => {
            const template = document.getElementById('template-community').content.cloneNode(true);
            const postsContainer = template.getElementById('guestbook-posts');
            const form = template.getElementById('guestbook-form');
            const input = template.getElementById('guestbook-input');
            const posts = JSON.parse(localStorage.getItem('youtubo_guestbook') || '[]');
            
            postsContainer.innerHTML = '';
            posts.slice().reverse().forEach(post => { // Usamos slice() para não modificar o array original
                const postEl = document.createElement('div');
                postEl.className = 'post';
                postEl.innerHTML = `<p><span class="post-header">${post.user}</span> <span class="post-time">(${new Date(post.time).toLocaleString()})</span></p><p>${post.text}</p>`;
                postsContainer.appendChild(postEl);
            });
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = input.value.trim();
                if (text) {
                    posts.push({ user: currentUser || 'Anonymous', text: text, time: new Date().toISOString() });
                    localStorage.setItem('youtubo_guestbook', JSON.stringify(posts));
                    renderers.community(); // Recarrega a página da comunidade
                }
            });
            dynamicContent.innerHTML = '';
            dynamicContent.appendChild(template);
        },
        search: (query) => {
            const template = document.getElementById('template-search').content.cloneNode(true);
            const title = template.getElementById('search-results-title');
            const grid = template.getElementById('search-video-grid');
            title.textContent = `Search Results for "${query}"`;
            
            const results = Object.values(youtubo_db.videos).filter(video => video.title.toLowerCase().includes(query.toLowerCase()));
            
            grid.innerHTML = '';
            if (results.length > 0) {
                results.forEach(video => renderVideoItem(video, grid, 'list'));
            } else {
                grid.innerHTML = `<p>No videos found matching your search term.</p>`;
            }
            dynamicContent.innerHTML = '';
            dynamicContent.appendChild(template);
        },
        profile: () => { /* ... (a ser implementado) ... */ }
    };

    // --- FUNÇÕES AUXILIARES ---
    function renderVideoItem(video, container, type) {
        const item = document.createElement('div');
        item.className = 'video-item';
        let innerHTML = '';
        if (type === 'list') {
            innerHTML = `<a href="videoPlayer.html?v=${video.id}"><img src="${video.thumbnail}" class="thumbnail"></a><div class="video-info"><a href="videoPlayer.html?v=${video.id}" class="video-title">${video.title}</a><span class="video-channel">From: <a href="userPage.html?id=${video.channelId}">${video.channelId}</a></span></div>`;
        } else { // grid
            innerHTML = `<a href="videoPlayer.html?v=${video.id}"><img src="${video.thumbnail}" class="thumbnail"></a><div class="video-info"><a href="videoPlayer.html?v=${video.id}" class="video-title">${video.title}</a></div>`;
        }
        item.innerHTML = innerHTML;
        container.appendChild(item);
    }

    function setupSubscribeButtons(container) {
        container.querySelectorAll('.subscribe-btn').forEach(btn => {
            const channelId = btn.dataset.channelId;
            const subKey = `youtubo_subscribed_${channelId}`;
            const updateState = () => {
                if (localStorage.getItem(subKey) === 'true') {
                    btn.textContent = 'Subscribed';
                    btn.classList.add('subscribed');
                } else {
                    btn.textContent = 'Subscribe';
                    btn.classList.remove('subscribed');
                }
            };
            btn.addEventListener('click', () => {
                localStorage.getItem(subKey) ? localStorage.removeItem(subKey) : localStorage.setItem(subKey, 'true');
                updateState();
            });
            updateState();
        });
    }

    // --- LÓGICA DE LOGIN ---
    function setupLoginModule(container) {
        if (currentUser) {
            container.innerHTML = `<div class="module-header"><h3>Welcome!</h3></div><div class="module-content welcome-box"><p>You are logged in as <strong>${currentUser}</strong>.</p><a href="#" data-page="profile">My Profile</a></div>`;
        } else {
            container.innerHTML = `<div class="module-header"><h3>Member Login</h3></div><div class="module-content"><form class="login-form" id="main-login-form"><label>User Name:</label><input type="text" id="username" autocomplete="username"><button type="submit">Login / Register</button></form></div>`;
            container.querySelector('#main-login-form').addEventListener('submit', e => {
                e.preventDefault();
                const user = container.querySelector('#username').value.trim();
                if (user) { localStorage.setItem('youtubo_user', user); window.location.reload(); }
            });
        }
    }

    function setupHeader() {
        const headerLinks = document.getElementById('header-links');
        if (currentUser) {
            headerLinks.innerHTML = `Welcome, <strong>${currentUser}</strong> | <a href="#" id="logout-btn">Log Out</a>`;
            headerLinks.querySelector('#logout-btn').addEventListener('click', e => {
                e.preventDefault();
                localStorage.removeItem('youtubo_user');
                window.location.reload();
            });
        } else {
            headerLinks.innerHTML = ``;
        }
    }

    // --- SETUP INICIAL E EVENT LISTENERS ---
    
    // Navegação Principal
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (renderers[page]) {
                renderers[page]();
            }
        });
    });

    // Busca
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            renderers.search(searchTerm);
        }
    });

    // Carrega a página inicial por padrão
    renderers.home();
    setupHeader();
});
