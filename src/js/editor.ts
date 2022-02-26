import { openTab, tabsOpened } from "./tabs";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { Compartment } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { darkStoryTypewriterCodeMirrorTheme } from "./themes/dark";

const language = new Compartment();

export function createNewFile() {
    let id = "untitled";
    let i = 0;
    while(true) {
        if(tabsOpened.indexOf(id) == -1) break;
        id = "untitled" + i;
        i++;
    }
    let name = "Untitled";
    if(i > 0) name += ` (${i})`;
    openTab(name, `<div id="${id}-editor"></div>`, id);
    const view = new EditorView({
        parent: document.getElementById(`${id}-editor`),
        state: EditorState.create({
            extensions: [
                basicSetup, 
                language.of(markdown()),
                darkStoryTypewriterCodeMirrorTheme
            ]
        })
    });
}