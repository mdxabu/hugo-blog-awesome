function loadGiscusBasedOnTheme() {
    const existing = document.getElementById("giscus-script");
    if (existing) return; // Prevent duplicate loading

    const theme = localStorage.getItem("theme") || "light";
    const giscusTheme = theme === "dark" ? "noborder_gray" : "light_protanopia";

    const container = document.createElement("div");
    container.id = "giscus-container";
    document.body.appendChild(container);

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "mdxabu/mdxabu.github.io");
    script.setAttribute("data-repo-id", "R_kgDOLs5FtQ");
    script.setAttribute("data-category", "Blogs");
    script.setAttribute("data-category-id", "DIC_kwDOLs5Ftc4CrYy-");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "0");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", giscusTheme);
    script.setAttribute("data-lang", "en");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;
    script.id = "giscus-script";

    container.appendChild(script);
}

window.addEventListener("DOMContentLoaded", loadGiscusBasedOnTheme);
