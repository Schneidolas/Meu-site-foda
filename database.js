// database.js - BANCO DE DADOS CENTRALIZADO E COM ESTILOS AVANÇADOS

const youtubo_db = {
    // ---- BANCO DE DADOS DE VÍDEOS ----
    videos: {
        'gmod': {
            id: 'gmod',
            title: "review de garry's mod",
            // !!! URL CORRIGIDA !!! - GitHub não funciona para streaming de vídeo direto. Use um host como o Internet Archive.
            url: 'https://github.com/Schneidolas/music/raw/refs/heads/main/review%20de%20garrys%20mod.mp4',
            thumbnail: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4000/ss_c13ffded1d71bedfa7ede94c11cbd21fbd21a32c.1920x1080.jpg?t=1736937068',
            description: 'esse jogo é muito legal o.o',
            channelId: 'Schneidola$'
        },
        'cscz': {
            id: 'cscz',
            title: 'counter strike condition zero',
            url: 'https://github.com/Schneidolas/music/raw/refs/heads/main/counter%20strike%20condition%20zero.mp4',
            thumbnail: 'https://upload.wikimedia.org/wikipedia/pt/f/f3/Counter-Strike_Condition_Zero.jpg',
            description: 'deixa as 5 estrela se ñ suas bola vão cair >:]',
            channelId: 'Schneidola$'
        },
        'gmodZoeira': {
            id: 'gmodZoeira',
            title: 'A fúria de Manoel gomes! - gmod',
            url: 'https://github.com/Schneidolas/music/raw/refs/heads/main/A%20F%C3%BAria%20de%20Manoel%20Gomes%20-%20Garry's%20Mod.mp3',
            thumbnail: 'https://i.imgur.com/b9Jc8zI.png',
            description: 'O hit do verão da Fenda do Biquini. Um clássico do rock cantado pelo Bob Esponja.',
            channelId: 'M@ast3rB4nan@'
        },
        'cat_fail': {
            id: 'cat_fail',
            title: 'MEU GATO FAZENDO PARKOUR (EPIC FAIL!!!)',
            url: 'https://archive.org/download/fail-compilation-2012/Fail%20Compilation%202012.mp4',
            thumbnail: 'https://i.ytimg.com/vi/fTczCp_yY6k/hqdefault.jpg',
            description: 'Gravei meu gato Miau-Miau tentando pular da estante. Não deu muito certo kkkkk',
            channelId: 'xX_G4m3r_Xx'
        }
    },

    // ---- BANCO DE DADOS DE CANAIS (COM CUSTOMIZAÇÃO COMPLETA) ----
    channels: {
        'Schneidola$': {
            name: 'Schneidola$',
            profilePic: 'https://media.tenor.com/hO9By4ph_I8AAAAM/speak.gif',
            banner: 'https://i.imgur.com/AsSrpQp.png', // URL corrigida para a imagem completa
            bio: 'Meu nome é Schneider, faço vídeos para internet, acho que é só isso ._.',
            subscribers: 28345,
            style: {
                fontFamily: "'Tahoma', 'Papyrus', sans-serif",
                pageBg: "url('https://cdn.shopifycdn.net/s/files/1/0598/3263/1453/files/star-background-gif-_no-shooting-star.gif?v=1668992315')", // Fundo da página
                windowColor: "#aa2d2d", // Cor das janelas
                textColor: "#be4444",
                borderColor: "#3a0000",
                linkColor: '#b20303',
                windowShadow: false, // A janela tem sombra?
                windowGloss: false, // A janela tem brilho?
                windowBgImage: "https://img.freepik.com/premium-vector/distress-grunge-texture_707519-7163.jpg", // URL para imagem de fundo da janela (deixar em branco se não usar)
                playerBarBg: "url('https://cdn.pfps.gg/banners/8859-elmo-s-hell-fire.gif')",
            }
        },
        'M@ast3rB4nan@': {
            name: 'M@ast3rB4nan@',
            profilePic: 'https://i.imgur.com/sZ4zL8A.png',
            banner: 'https://i.imgur.com/kY7aJ9T.jpeg',
            bio: 'Relembrando os melhores momentos da TV e da internet antiga.',
            subscribers: 125987,
            style: {
                fontFamily: "'Courier New', monospace",
                pageBg: "#222222",
                windowColor: "#f0f0f0",
                textColor: "#000000",
                borderColor: "#444444",
                linkColor: '#00cc00',
                windowShadow: false,
                windowGloss: false,
                windowBgImage: "https://i.imgur.com/jQ7BvA5.png",
                playerBarBg: "linear-gradient(to bottom, #4a4a4a, #2b2b2b)",
            }
        },
         'xX_G4m3r_Xx': {
            name: 'xX_G4m3r_Xx',
            profilePic: 'https://i.imgur.com/6XyqE9p.jpeg',
            banner: 'https://i.imgur.com/9C3A8s5.gif',
            bio: 'VIDEOS DE JOGOS E FAILS ENGRAÇADOS!! SE INSCREVA!!1!',
            subscribers: 5421,
            style: {
                fontFamily: "'Comic Sans MS', cursive",
                pageBg: "url('https://www.din.ca/images/starfield.gif')",
                windowColor: "#000033",
                textColor: "#FFFFFF",
                borderColor: "#FF00FF",
                linkColor: '#00FFFF',
                windowShadow: true,
                windowGloss: false,
                windowBgImage: "",
                playerBarBg: "linear-gradient(to bottom, #4a4a4a, #2b2b2b)",
            }
        }
    }
};
