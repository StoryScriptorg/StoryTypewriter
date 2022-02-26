import type { ComponentObject } from "../cms";
import { openAboutMenu } from '../tabs';
import { createNewFile } from '../editor';

function afterRender(): void {
    document.getElementById("createNewFile").addEventListener("click", () => createNewFile());
    document.getElementById("openAboutMenu").addEventListener("click", () => openAboutMenu());
}

export default function WelcomeTab(): ComponentObject {
    return {
        afterRender: afterRender,
        source: `<div class="container">
    <h1>Welcome</h1>
    
    <button class="block link-btn" id="createNewFile">
        <span class="material-icons">
            post_add
        </span>
        Create new file
    </button>
    <button class="block link-btn">
        <span class="material-icons">
            file_open
        </span>
        Open a file
    </button>
    <button class="block link-btn">
        <span class="material-icons">
            folder_open
        </span>
        Open a folder
    </button>
    <br>
    <button class="block link-btn">
        <span class="material-icons">
            settings
        </span>
        Preferences
    </button>
    <button class="block link-btn" id="openAboutMenu">
        <span class="material-icons">
            info
        </span>
        About
    </button>
</div>`
    };
}