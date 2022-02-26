import "./tabs";
import { render, useComponent } from "./cms";
import { NL_VERSION, NL_CVERSION } from "./vars";
import WelcomeTab from "./components/WelcomeTab";
import "highlight.js/styles/obsidian.css";
import { darkStoryTypewriter } from "./themes/dark";

declare const Neutralino: any;
declare const NL_MODE: string;
declare const NL_OS: string;

const themes: { [name: string] : Theme } = {
    light: {
        background: "white",
        darkerBackground: "whitesmoke",
        evenDarkerBackground: "#ccc",
        textColor: "black",
        linkColor: "darkblue"
    },
    dark: darkStoryTypewriter
};

interface IEditorConfiguration {
    theme: string;
    firstUse: boolean;
    animations: "always" | "minimal" | "never";
}

function setTray() {
    if(NL_MODE != "window") {
        console.log("INFO: Tray menu is only available in the window mode.");
        return;
    }
    let tray = {
        icon: "/resources/icons/trayIcon.png",
        menuItems: [
            {id: "VERSION", text: "About"},
            {id: "SEP", text: "-"},
            {id: "QUIT", text: "Quit"}
        ]
    };
    Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case "VERSION":
            Neutralino.os.showMessageBox(
                "About",
                `StoryTypewriter: v0.1.0
NeutralinoJS server: v${NL_VERSION} | NeutralinoJS client: v${NL_CVERSION}`
            );
            break;
        case "QUIT":
            Neutralino.app.exit();
            break;
    }
}

function onWindowClose() {
    Neutralino.app.exit();
}

render(document.getElementById("welcome"), useComponent(WelcomeTab()));

Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

let config: IEditorConfiguration;
Neutralino.storage.getData("config").then((data: string) => {
    config = JSON.parse(data);
    for(const property of [
        ["background", "--background"],
        ["darkerBackground", "--darker-background"],
        ["evenDarkerBackground", "--even-darker-background"],
        ["textColor", "--text-color"],
        ["linkColor", "--link-color"]
    ]) {
        document.body.style.setProperty(property[1], themes[config.theme][property[0]]);
    }
}).catch((error: Object) => {
    console.error(error);
});


if(NL_OS != "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
    setTray();
}
