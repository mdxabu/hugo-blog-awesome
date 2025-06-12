function getGiscusTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  return theme === 'dark' ? 'noborder_gray' : 'light_protanopia';
}

function loadGiscus() {
  const container = document.getElementById('giscus-container');
  if (!container) return;

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'mdxabu/mdxabu.github.io');
  script.setAttribute('data-repo-id', 'R_kgDOLs5FtQ');
  script.setAttribute('data-category', 'Blogs');
  script.setAttribute('data-category-id', 'DIC_kwDOLs5Ftc4CrYy-');
  script.setAttribute('data-mapping', 'pathname');
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '0');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'top');
  script.setAttribute('data-theme', getGiscusTheme());
  script.setAttribute('data-lang', 'en');
  script.setAttribute('crossorigin', 'anonymous');
  script.async = true;

  container.appendChild(script);
}

// Initial load
loadGiscus();

// Reload Giscus when theme changes
window.addEventListener('storage', (event) => {
  if (event.key === 'theme') {
    loadGiscus();
  }
});
