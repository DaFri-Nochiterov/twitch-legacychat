// ==UserScript==
// @name         Twitch.tv LegacyChat
// @version      0.9.1
// @description  Returns legacy chat to the Twitch page.
// @author       DaFri_Nochiterov
// @updateURL    https://github.com/DaFri-Nochiterov/twitch-legacychat/raw/master/twitch-legacychat.user.js
// @match        https://www.twitch.tv/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

const SLEEP_BEFORE_INIT = 5000;

const createChatFrame = (username) => {
    if (!username) { throw new Error("No username passed"); }

    const frame = document.createElement("iframe");

    frame.setAttribute("src", `https://www.twitch.tv/${username}/chat?popout=`);

    frame.style.height = "100%";
    frame.classList.add("legacychat_frame");

    return frame;
};

const initChat = (username) => {
    const column = document.querySelectorAll("div[data-test-selector=chat-room-component-layout]")[0];
    if (!column) { return console.error("[LegacyChat] Failed to get chat column"); }
    column.innerHTML = createChatFrame(username).outerHTML;
    console.info("[LegacyChat] Done creating legacy chat frame");
};

const getChannelUsername = () => {
    const uriUsername = location.pathname.match(/^\/([a-z0-9\_]{3,24})/);
    if(!uriUsername || uriUsername.length !== 2) { throw new Error("Could not find username in `pathname`"); }
    return uriUsername[1];
};

const init = () => {
    let username = "";
    try {
        username = getChannelUsername();
    } catch (err) {
        return console.error("[LegacyChat] Failed to get channel username:", err);
    }
    if (!username) { return console.error("[LegacyChat] No username returned"); }
    console.info("[LegacyChat] Initializing legacy chat for username", username, "may took a seconds");
    initChat(username);
};

console.info("[LegacyChat] Hello o/");
console.info("[LegacyChat] Scheduling chat initialization in 5 seconds");
if (location.hostname === "www.twitch.tv" && !location.pathname.endsWith("/chat")) {
    setTimeout(() => init(), SLEEP_BEFORE_INIT);
}