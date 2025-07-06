// database.js - BANCO DE DADOS CENTRALIZADO E COM ESTILOS AVANÇADOS

const youtubo_db = {
    // ---- BANCO DE DADOS DE VÍDEOS ----
    videos: {
        'gmod': {
            id: 'gmod',
            title: "Review de Garry's Mod",
            // !!! URL CORRIGIDA !!! - GitHub não funciona para streaming de vídeo direto. Use um host como o Internet Archive.
            url: 'https://github.com/Schneidolas/music/raw/refs/heads/main/review%20de%20garrys%20mod.mp4',
            thumbnail: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4000/ss_c13ffded1d71bedfa7ede94c11cbd21fbd21a32c.1920x1080.jpg?t=1736937068',
            description: 'Gameplay nostálgica de GMod, um clássico da Steam!',
            channelId: 'Schneidola$'
        },
        'cscz': {
            id: 'cscz',
            title: 'Counter-Strike: Condition Zero - Missão Secreta',
            url: 'https://archive.org/download/cscz-deleted-scenes-mission-7-fastline/CSCZ%20Deleted%20Scenes%20Mission%207%20Fastline.mp4',
            thumbnail: 'https://i.imgur.com/N74hY4h.png',
            description: 'Jogando uma das melhores missões do CS:CZ. Pura nostalgia!',
            channelId: 'Schneidola$'
        },
        'spongebob': {
            id: 'spongebob',
            title: 'Bob Esponja cantando Rock - Rasguei as Calças',
            url: 'https://ia803201.us.archive.org/17/items/spongebob-rip-pants-song/Spongebob%20Rip%20Pants%20Song.mp4',
            thumbnail: 'https://i.imgur.com/b9Jc8zI.png',
            description: 'O hit do verão da Fenda do Biquini. Um clássico do rock cantado pelo Bob Esponja.',
            channelId: 'CanalNostalgia'
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
                fontFamily: "'Tahoma', 'Verdana', sans-serif",
                pageBg: "url('https://i.imgur.com/vXDWqIHg.jpg')", // Fundo da página
                windowColor: "#241010", // Cor das janelas
                textColor: "#dad7d7",
                borderColor: "#3a0000",
                linkColor: '#b20303',
                windowShadow: false, // A janela tem sombra?
                windowGloss: false, // A janela tem brilho?
                windowBgImage: "", // URL para imagem de fundo da janela (deixar em branco se não usar)
            }
        },
        'CanalNostalgia': {
            name: 'CanalNostalgia',
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
            }
        }
    }
};
