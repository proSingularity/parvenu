import { CityName } from "../logic/CityName";

const scenify = (str: string) => `${str}-scene`;
const imgify = (str: string) => `${str}-img`;
const sfxify = (str: string) => `${str}-sfx`;

export const KEYS = {
    events: {
        cityChanged: "city-changed",
    },
    scenes: {
        citySelection: scenify("city-selection"),
        gameOver: scenify("game-over"),
        loading: scenify("loading"),
        main: scenify("main"),
        table: scenify("table"),
        warehouse: scenify("warehouse"),
    },
    // key of the corresponding objects inside the global data registry
    registry: {
        cities: "cities",
        logic: "logic",
        player: "player",
    },
    sound: {
        sell: {
            key: sfxify("sell"),
            path: "./assets/sounds/sell.wav",
        },
        buy: {
            key: sfxify("buy"),
            path: "./assets/sounds/buy.wav",
        },
        backgroundMusic: {
            key: "background-music",
            path: "./assets/sounds/bgm.mp3",
        },
    },
    images: {
        logo: {
            key: imgify("logo"),
            // TODO replace placeholder by logo
            path: "./assets/images/parchment640x480.png",
            width: 640,
            height: 480,
        },
        culemborgCastle: {
            key: imgify("culemborg-castle"),
            path: "./assets/images/culemborg-castle800x524.png",
            width: 800,
            height: 524,
        },
        heltishCastle: {
            key: imgify("heltish-castle"),
            path: "./assets/images/background500x300.png",
            width: 500,
            height: 300,
        },
        harborWithBoats: {
            key: imgify("harbor-with-boats"),
            path:
                "./assets/images/Claude_Monet_Fishing_Boats_Leaving_the_Harbor_Le_Havre_1178×713px.jpg",
            width: 1178,
            height: 713,
        },
        gameOver: {
            key: imgify("game-over"),
            path: "./assets/images/game-over501x301.png",
            width: 501,
            height: 301,
        },
        parchment: {
            key: imgify("parchment"),
            path: "./assets/images/parchment640x480.png",
            width: 640,
            height: 480,
        },
        buttonUpRect: {
            key: imgify("button-up-rect"),
            path: "./assets/images/button-up-rect198x128.png",
            width: 200,
            height: 200,
        },
    },
};

export const cityViewConfig = {
    [CityName.Rostock]: {
        backgroundImage: KEYS.images.culemborgCastle,
    },
    [CityName.Hamburg]: {
        backgroundImage: KEYS.images.harborWithBoats,
    },
    [CityName.Wismar]: {
        backgroundImage: KEYS.images.heltishCastle,
    },
};
