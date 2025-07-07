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
            url: "https://github.com/Schneidolas/music/raw/refs/heads/main/a%20furia%20gmod.mp4",
            thumbnail: 'https://pt.quizur.com/_image?href=https://img.quizur.com/f/img63e930e5e14e53.97204741.jpg?lastEdited=1676226797&w=600&h=600&f=webp',
            description: 'o manoel gomes vai te pegar de noite se vc nn se inscrever ashuashuashaushausha',
            channelId: 'M@ast3rB4nan@'
        },
        'dedust2': {
            id: 'dedust2',
            title: 'de_dust 2',
            url: "https://github.com/Schneidolas/music/raw/refs/heads/main/Counter-Strike%20-%20DE%20dust2%20HD.mp4",
            thumbnail: 'https://i.ytimg.com/vi/5Cjrp23lBSM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCELshUZ2cB9NTQQRypUloI954yUg',
            description: '',
            channelId: 'Flashdeck'
        },
        'dedust2': {
            id: 'dedust2',
            title: 'de_dust 2 (youtube test)',
            url: "https://www.youtube.com/watch?v=5Cjrp23lBSM",
            thumbnail: 'https://i.ytimg.com/vi/5Cjrp23lBSM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCELshUZ2cB9NTQQRypUloI954yUg',
            description: '',
            channelId: 'Flashdeck'
        }
    },

    // ---- BANCO DE DADOS DE CANAIS (COM CUSTOMIZAÇÃO COMPLETA) ----
    channels: {
        'Schneidola$': {
            name: 'Schneidola$',
            profilePic: 'https://media.tenor.com/hO9By4ph_I8AAAAM/speak.gif',
            banner: 'https://i.imgur.com/AsSrpQp.png', // URL corrigida para a imagem completa
            bio: 'Meu nome é Schneider, faço vídeos para internet, acho que é só isso ._.',
            subscribers: 226,
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
            profilePic: 'https://media.tenor.com/RQKAyM7ZHA0AAAAM/banana-dance.gif',
            banner: 'https://i.pinimg.com/originals/48/16/33/481633f1184fed769ed4f7aef5d5ff36.gif',
            bio: 'eu sou o Master Banana, seja bem vindo a um canal com muita zueiraa ashuashuahsuhauhauhauhauh >:]',
            subscribers: 125987,
            style: {
                fontFamily: "'Comic Sans', Papyrus",
                pageBg: "url('https://wallpapers.com/images/hd/rage-comics-faces-meme-xkb1a97vt1j8pqcd.jpg')",
                windowColor: "#f0f0f0",
                textColor: "#000000",
                borderColor: "#444444",
                linkColor: '#00cc00',
                windowShadow: false,
                windowGloss: false,
                windowBgImage: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.wallpaperflare.com%2Ftroll-face-illustration-wallpaper-30088%2F1024x1024&psig=AOvVaw2hAjwaWrzacm1uSWAmk46R&ust=1751908753997000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLixs-reqI4DFQAAAAAdAAAAABAv",
                playerBarBg: "url('https://sociotramas.wordpress.com/wp-content/uploads/2012/12/remix_and_meme_sociotramas-fw.png')",
            }
        },
        'Flashdeck': {
            name: 'Flashdeck',
            profilePic: 'https://pbs.twimg.com/profile_images/1498957369/Flashdeck-logo_400x400.png',
            banner: 'https://static.tvtropes.org/pmwiki/pub/images/flashdeck.jpg',
            bio: 'Flashdeck é um time de animações!',
            subscribers: 59492394,
            style: {
                fontFamily: 'Arial',
                pageBg: "url('https://www.patternpictures.com/wp-content/uploads/Crumpled-white-paper-texture-background-768x512.jpg')",
                windowColor: "#f0f0f0",
                textColor: "#000000",
                borderColor: "#444444",
                linkColor: '#087D07',
                windowShadow: false,
                windowGloss: false,
                windowBgImage: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.wallpaperflare.com%2Ftroll-face-illustration-wallpaper-30088%2F1024x1024&psig=AOvVaw2hAjwaWrzacm1uSWAmk46R&ust=1751908753997000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLixs-reqI4DFQAAAAAdAAAAABAv",
                playerBarBg: "linear-gradient(to bottom, #022701, #087705)",
            }
        }
    }
};
