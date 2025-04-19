document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const url = decodeURIComponent(params.get("url") || "about:blank");
    const title = decodeURIComponent(params.get("title") || "Tab Suspended");
    const time = decodeURIComponent(params.get("time") || "");

    document.getElementById("title").textContent = title;
    document.getElementById("url").textContent = url;
    document.getElementById("time").textContent =
        new Date().toDateString() + " " + new Date().toLocaleTimeString();

    document.getElementById("reloadBtn").addEventListener("click", () => {
        window.location.href = url;
    });
});
