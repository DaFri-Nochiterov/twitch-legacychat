// ==UserScript==
// @name         Twitch.tv LegacyChat
// @version      0.9.1
// @description  Returns legacy chat to the Twitch page.
// @author       DaFri_Nochiterov
// @match        https://www.twitch.tv/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

const initChat = (username) => {
    if (!username) { throw new Error("No username passed"); }
    const column = $("div.channel-page__right-column")[0];
    if (!column) { return console.error("[LegacyChat] Failed to get chat column"); }
    let chatFrame = $("<iframe>").attr({
        src: `https://www.twitch.tv/${username}/chat?popout=`,
        class: "legacychat_frame"
    }).css({
        height: "100%"
    });
    console.info("[LegacyChat] Inserting chat into column. Here magic happens");
    $(column).html(chatFrame);
};

const getChannelUsername = () => {
    const header = $("a[data-a-target='user-channel-header-item']")[0];
    if (!header) { throw new Error("Header item not found"); }
    let uri = header.href;
    uri = uri.slice("https://".length);
    const slashes = uri.match(/\//g); // finding slashes as they point if it's videos or not
    // then checking this 'point'
    if (slashes && slashes.length > 1) { throw new Error("It's not a channel"); }
    uri = uri.slice(uri.indexOf("/") + 1);
    return uri;
};

const init = () => {
    let username = "";
    try {
        username = getChannelUsername();
    } catch (err) {
        return console.error("[LegacyChat] Failed to get channel username, header was removed or something broken?", err);
    }
    if (!username) { return console.error("[LegacyChat] We could not find username. WOW, RUDE!"); }
    console.info("[LegacyChat] Initializing legacy chat for username", username, "may took a seconds");
    initChat(username);
};

console.info("[LegacyChat] Hello o/");
console.info("[LegacyChat] Scheduling chat initialization in 5 seconds");
if (!location.pathname.endsWith("/chat")) {
    setTimeout(() => init(), 5000);
}