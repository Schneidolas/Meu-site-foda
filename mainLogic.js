// mainLogic.js - VERSÃO CORRIGIDA E CENTRALIZADA

document.addEventListener('DOMContentLoaded', () => {
    const dynamicContent = document.getElementById('dynamic-content');
    const navLinks = document.querySelectorAll('#nav-bar a');
    let currentUser = localStorage.getItem('youtubo_user');

    // --- RENDERIZADORES DE CONTEÚDO ---
    const renderers = {
        home: () => {
            const template = document.getElementById('template-home').content.cloneNode(true);
            const videoGrid = template.getElementById('video-grid');
            Object.values(youtubo_db.videos).slice(0, 4).forEach(video => renderVideoItem(video, videoGrid, 'list'));
            setupLogin(template.getElementById('login-module'));
            dynamicContent.innerHTML = '';
            dynamicContent.appendChild(template);
        },
        videos: () => {
            const template = document.getElementById('template-videos').content.cloneNode(true);
            const videoGrid = template.getElementById('video-grid-full');
            Object.values(youtubo_db.videos).forEach(video => renderVideoItem(video, videoGrid, 'grid'));
            dynamicContent.innerHTML = '';
            dynamicContent.appendChild(template);
        },
        channels: () => {
            const template = document.getElementById('template-channels').content.cloneNode(true);
            const channelList = template.getElementById('channel-list');
            Object.values(youtubo_db.channels).forEach(channel => {
                const item = document.createElement('div');
                item.className = 'channel-item';
                // Adicionamos um ID único ao botão para poder controlá-lo
                item.innerHTML = `
                    <img src="${channel.profilePic}" class="channel-pic">
                    <div class="channel-info">
                        <h4><a href="userPage.html?id=${channel.name}">${channel.name}</a></h4>
                        <span>${channel.subscribers.toLocaleString()} subscribers</span>
                    </div>
                    <button class="subscribe-btn" data-channel-id="${channel.name}">Subscribe</button>
                `;
                channelList.appendChild(item);
            });

            // Lógica para atualizar e controlar TODOS os botões de inscrição na página
            channelList.querySelectorAll('.subscribe-btn').forEach(btn => {
                const channelId = btn.dataset.channelId;
                const subKey = `youtubo_subscribed_${channelId}`;

                const updateBtnState = () => {
                    if (localStorage.getItem(subKey) === 'true') {
                        btn.textContent = 'Subscribed';
                        btn.classList.add('subscribed'); // Adiciona uma classe para estilização, se necessário
                    } else {
                        btn.textContent = 'Subscribe';
                        btn.classList.remove('subscribed');
                    }
                };

                btn.addEventListener('click', () => {
                    if (localStorage.getItem(subKey) === 'true') {
                        localStorage.removeItem(subKey);
                    } else {
                        localStorage.setItem(subKey, 'true');
                    }
                    updateBtnState();
                });

                updateBtnState(); // Define o estado inicial do botão
            });

            dynamicContent.innerHTML = '';
            dynamicContent.appendChild(template);
        },
        community: () => {
            const template = document.getElementById('template-community').content.cloneNode(true);
            const postsContainer = template.getElementById('guestbook-posts');
            const form = template.getElementById('guestbook-form');
            const input = template.getElementById('guestbook-input');

            // Carrega posts salvos
            const posts = JSON.parse(localStorage.getItem('youtubo_guestbook') || '[]');
            postsContainer.innerHTML = '';
            posts.reverse().forEach(post => { // .reverse() para mostrar os mais novos primeiro
                const postEl = document.createElement('div');
                postEl.className = 'post';
                postEl.innerHTML = `<p><span class="post-header">${post.user || 'Anonymous'}</span> <span class="post-time">(${new Date(post.time).toLocaleString()})</span></p><p>${post.text}</p>`;
                postsContainer.appendChild(postEl);
            });

            // Lida com o envio de um novo post
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = input.value.trim();
                if (text) {
                    const newPost = {
                        user: currentUser || 'Anonymous', // Usa o usuário logado ou "Anonymous"
                        text: text,
                        time: new Date().toISOString()
                    };
                    posts.unshift(newPost); // Adiciona no início do array
                    localStorage.setItem('youtubo_guestbook', JSON.stringify(posts));
                    renderers.community(); // Recarrega a página da comunidade para mostrar o novo post
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
        
        const results = Object.values(youtubo_db.videos).filter(video => 
            video.title.toLowerCase().includes(query.toLowerCase()) ||
            video.description.toLowerCase().includes(query.toLowerCase())
        );

        grid.innerHTML = '';
        if (results.length > 0) {
            results.forEach(video => renderVideoItem(video, grid, 'list')); // Reutiliza nossa função de renderizar vídeos
        } else {
            grid.innerHTML = `<p>No videos found matching your search term.</p>`;
        }

        dynamicContent.innerHTML = '';
        dynamicContent.appendChild(template);
    },
        profile: () => {
            if (!currentUser) { renderers.home(); return; }
            const template = document.getElementById('template-profile').content.cloneNode(true);
            template.getElementById('profile-username').textContent = currentUser;
            dynamicContent.innerHTML = '';
            dynamicContent.appendChild(template);
        }
    };

    function renderVideoItem(video, container, type) {
        const item = document.createElement('div');
        item.className = 'video-item';
        if (type === 'list') {
            item.innerHTML = `<a href="videoPlayer.html?v=${video.id}"><img src="${video.thumbnail}" class="thumbnail"></a><div class="video-info"><a href="videoPlayer.html?v=${video.id}" class="video-title">${video.title}</a><span class="video-channel">From: <a href="userPage.html?id=${video.channelId}">${video.channelId}</a></span></div>`;
        } else { // grid
            item.innerHTML = `<a href="videoPlayer.html?v=${video.id}"><img src="${video.thumbnail}" class="thumbnail"></a><div class="video-info"><a href="videoPlayer.html?v=${video.id}" class="video-title">${video.title}</a></div>`;
        }
        container.appendChild(item);
    }

    // --- LÓGICA DE LOGIN ---
    function setupLogin(container) {
        if (!container) return;
        if (currentUser) {
            container.innerHTML = `<div class="module-header"><h3>Welcome!</h3></div><div class="module-content welcome-box"><p>You are logged in as <strong>${currentUser}</strong>.</p><a href="#" data-page="profile">My Profile</a></div>`;
            container.querySelector('[data-page="profile"]').addEventListener('click', (e) => { e.preventDefault(); renderers.profile(); });
        } else {
            container.innerHTML = `<div class="module-header"><h3>Member Login</h3></div><div class="module-content"><form class="login-form" id="main-login-form"><label>User Name:</label><input type="text" id="username"><button type="submit">Login / Register</button></form></div>`;
            container.querySelector('#main-login-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const user = container.querySelector('#username').value.trim();
                if (user) {
                    localStorage.setItem('youtubo_user', user);
                    currentUser = user;
                    setupHeader();
                    renderers.home();
                }
            });
        }
    }
    
    function setupHeader() {
        const headerLinks = document.getElementById('header-links');
        if (currentUser) {
            headerLinks.innerHTML = `Welcome, <strong>${currentUser}</strong> | <a href="#" id="logout-btn">Log Out</a>`;
            headerLinks.querySelector('#logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('youtubo_user');
                currentUser = null;
                setupHeader();
                renderers.home();
            });
        } else {
            headerLinks.innerHTML = ``; // Limpo, pois o login está na sidebar
        }
    }

    // --- NAVEGAÇÃO ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (renderers[page]) {
                renderers[page]();
            }
        });
    });

    // --- INICIALIZAÇÃO ---
    renderers.home(); // Carrega a página inicial por padrão
    setupHeader();
});
