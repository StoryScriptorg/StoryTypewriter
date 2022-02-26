import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import { NL_APPVERSION } from "./vars";
const tabsContainer: HTMLElement = document.querySelector(".tabs");
let tabs: NodeListOf<HTMLElement> = document.querySelectorAll('[data-tab-target]');
const tabContentContainer: HTMLElement = document.querySelector(".tab-content");
let tabContents: NodeListOf<HTMLElement> = document.querySelectorAll('[data-tab-content]');
export const tabsOpened: string[] = [];

hljs.registerLanguage("javascript", javascript);

tabs.forEach(tab => {
    tabsOpened.push(document.querySelector(tab.dataset.tabTarget).id);
    tab.addEventListener('click', () => {
        const target: HTMLElement = document.querySelector(tab.dataset.tabTarget);
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active');
        });
        tabs.forEach(tabContent => {
            tabContent.classList.remove('active');
        });
        tab.classList.add('active');
        target.classList.add('active');
    })
});

export function openTab(title: string, content: string, id: string = title.toLowerCase().replaceAll(" ", "-")) {
    const tab = document.createElement("li");
    tab.classList.add("tab");
    tab.setAttribute("data-tab-target", `#${id}`);
    tab.innerText = title;
    const closeIcon = document.createElement("span");
    closeIcon.classList.add("material-icons");
    closeIcon.innerText = "close";
    closeIcon.addEventListener("click", () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        const indexOfCurrentTab = tabsOpened.indexOf(target.id);
        tabsOpened.splice(indexOfCurrentTab, 1);
        tab.remove();
        target.remove();
        if(indexOfCurrentTab - 1 < 0) {
            (document.querySelector(`[data-tab-target="#${tabsOpened[0]}"]`) as HTMLElement).click();
        } else {
            (document.querySelector(`[data-tab-target="#${tabsOpened[indexOfCurrentTab - 1]}"]`) as HTMLElement).click();
        }
    });
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        if(!target) return;
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active');
        });
        tabs.forEach(tabContent => {
            tabContent.classList.remove('active');
        });
        tab.classList.add('active');
        target.classList?.add('active');
    });
    tab.appendChild(closeIcon);
    tabs = document.querySelectorAll('[data-tab-target]');
    
    const tabContent = document.createElement("div");
    tabContent.id = id;
    tabContent.setAttribute("data-tab-content", "");
    tabContent.innerHTML = content;
    
    tabsContainer.appendChild(tab);
    tabContentContainer.appendChild(tabContent);
    tabContents = document.querySelectorAll('[data-tab-content]');
    tab.click();
    tabsOpened.push(tabContent.id);
}

export function openAboutMenu() {
    openTab("About", `<div class="container">
    <h1>StoryTypewriter</h1>
    <p>StoryTypewriter is a simple IDE for StoryScript.</p>
    <p>
        <pre id="about-storytypewriter-editor">
<code class="language-json">{
    "name": "StoryTypewriter",
    "version": "${NL_APPVERSION}",
    "devDependencies": {
        "@parcel/transformer-less": "^2.3.1",
        "parcel": "^2.3.1"
    },
    "dependencies": {
        "@codemirror/basic-setup": "^0.19.1",
        "@codemirror/lang-markdown": "^0.19.6",
        "gsap": "^3.9.1",
        "highlight.js": "^11.4.0"
    },
    "license": "MIT"
}</code>
       </pre>
    </p>
</div>`);
    hljs.highlightElement(document.getElementById("about-storytypewriter-editor"));
}

