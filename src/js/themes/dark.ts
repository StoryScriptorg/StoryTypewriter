/**
 * Dark StoryTypewriter - CodeMirror theme
*/

import { EditorView } from "@codemirror/basic-setup";

export const darkStoryTypewriter: Theme = {
    background: "#2c2f33",
    darkerBackground: "#23272a",
    evenDarkerBackground: "#1a1d20",
    textColor: "white",
    linkColor: "cornflowerblue"
};

export const darkStoryTypewriterCodeMirrorTheme = EditorView.theme({
    "&": {
        color: darkStoryTypewriter.textColor,
        backgroundColor: darkStoryTypewriter.background
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: darkStoryTypewriter.darkerBackground
    },
    ".cm-content": {
        caretColor: darkStoryTypewriter.textColor
    },
    "&.cm-focused .cm-cursor": {
        borderLeftColor: darkStoryTypewriter.textColor
    },
    ".cm-gutters": {
        backgroundColor: darkStoryTypewriter.evenDarkerBackground,
        color: darkStoryTypewriter.textColor,
        border: "none"
    },
    ".cm-activeLine": {
        backgroundColor: darkStoryTypewriter.darkerBackground
    }
}, { dark: true });