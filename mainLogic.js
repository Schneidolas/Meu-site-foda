// mainLogic.js - O CÉREBRO DE TODAS AS PÁGINAS

document.addEventListener('DOMContentLoaded', () => {
    const pageId = document.body.id; // Vamos usar IDs no body para saber qual página estamos
    let currentUser = localStorage.getItem('youtubo_user');

    // --- FUNÇÕES GLOBAIS ---
    function renderHeader() {
        const headerLinks = document.getElementById('header-links');
        if (currentUser) {
            headerLinks.innerHTML = `Welcome, <strong>${currentUser}</strong> | <a href="#" id="logout-btn">Log Out</a>`;
            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('youtubo_user');
                window.location.reload();
            });
        } else {
            headerLinks.innerHTML = `<a href="#">Sign Up</a> | <a href="#">Log In</a>`;
        }
    }

    function handleSearch() {
        const searchForm = document.getElementById('search-form');
        const searchInput = document.getElementById('search-input');
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // --- LÓGICA POR PÁGINA ---

    // Lógica para a PÁGINA INICIAL (index.html)
    if (document.querySelector('#video-grid')) {
        const videoGrid = document.getElementById('video-grid');
        // Pega os 4 primeiros vídeos como "Featured"
        Object.values(youtubo_db.videos).slice(0, 4).forEach(video => {
            const videoElement = document.createElement('div');
            videoElement.className = 'video-item';
            videoElement.innerHTML = `...`; // Lógica de renderização igual à anterior
            videoGrid.appendChild(videoElement);
        });

        // Lógica de Login/Registro
        const loginModule = document.getElementById('login-module');
        if (currentUser) {
            loginModule.innerHTML = `<div class="module-header"><h3>Welcome!</h3></div><div class="module-content welcome-box"><p>You are logged in as <strong>${currentUser}</strong>.</p><a href="#">My Profile</a></div>`;
        } else {
            loginModule.innerHTML = `
                <div class="module-header"><h3>Member Login</h3></div>
                <div class="module-content">
                    <form class="login-form" id="login-form-main">
                        <label>User Name:</label><input type="text" id="username">
                        <button type="submit">Login</button>
                        <a href="#" class="form-switch-link" id="show-register">New? Sign up!</a>
                    </form>
                    <form class="login-form" id="register-form-main" style="display:none;">
                        <label>Choose a User Name:</label><input type="text" id="new-username">
                        <button type="submit">Register</button>
                        <a href="#" class="form-switch-link" id="show-login">Have an account? Login.</a>
                    </form>
                </div>`;
            
            const loginForm = document.getElementById('login-form-main');
            const registerForm = document.getElementById('register-form-main');
            
            document.getElementById('show-register').addEventListener('click', () => { loginForm.style.display = 'none'; registerForm.style.display = 'block'; });
            document.getElementById('show-login').addEventListener('click', () => { loginForm.style.display = 'block'; registerForm.style.display = 'none'; });

            loginForm.addEventListener('submit', (e) => { e.preventDefault(); const user = document.getElementById('username').value.trim(); if (user) { localStorage.setItem('youtubo_user', user); window.location.reload(); } });
            registerForm.addEventListener('submit', (e) => { e.preventDefault(); const user = document.getElementById('new-username').value.trim(); if (user) { localStorage.setItem('youtubo_user', user); window.location.reload(); } });
        }
    }

    // Lógica para a PÁGINA DE VÍDEOS (videos.html)
    if (document.querySelector('#video-grid-full')) {
        const videoGridFull = document.getElementById('video-grid-full');
        Object.values(youtubo_db.videos).forEach(video => {
            const videoElement = document.createElement('div');
            videoElement.className = 'video-item';
            videoElement.innerHTML = `...`; // Mesma lógica de renderização
            videoGridFull.appendChild(videoElement);
        });
    }

    // Lógica para a PÁGINA DE CANAIS (channels.html)
    if (document.querySelector('#channel-list')) {
        const channelList = document.getElementById('channel-list');
        Object.values(youtubo_db.channels).forEach(channel => {
            const channelElement = document.createElement('div');
            channelElement.className = 'channel-item';
            channelElement.innerHTML = `...`; // Lógica de renderização de canal
            channelList.appendChild(channelElement);
        });
    }

    // Lógica para a PÁGINA DE BUSCA (search.html)
    if (document.querySelector('#search-video-grid')) {
        const params = new URLSearchParams(window.location.search);
        const searchTerm = params.get('q')?.toLowerCase() || '';
        document.getElementById('search-results-title').textContent = `Search Results for "${searchTerm}"`;
        const searchGrid = document.getElementById('search-video-grid');
        const results = Object.values(youtubo_db.videos).filter(v => v.title.toLowerCase().includes(searchTerm));
        if (results.length > 0) {
            results.forEach(video => { /* renderiza os vídeos */ });
        } else {
            searchGrid.innerHTML = `<p>No videos found.</p>`;
        }
    }

    // Lógica para a PÁGINA DE COMUNIDADE (community.html)
    if (document.querySelector('#guestbook-posts')) {
        // ... Lógica para carregar e salvar posts do guestbook no localStorage ...
    }

    // --- Executa funções globais em todas as páginas ---
    renderHeader();
    handleSearch();
});
