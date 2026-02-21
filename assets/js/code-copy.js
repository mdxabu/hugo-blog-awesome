// Code Copy Functionality
// Adds a copy button to all code blocks

(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCodeCopy);
    } else {
        initCodeCopy();
    }

    function initCodeCopy() {
        const codeBlocks = document.querySelectorAll('pre');

        codeBlocks.forEach((pre) => {
            // Skip if already processed
            if (pre.parentElement.classList.contains('code-block')) {
                return;
            }

            // -----------------------------
            // Create wrapper
            // -----------------------------
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block';

            // Insert wrapper before <pre>
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            // -----------------------------
            // Create copy button
            // -----------------------------
            const button = document.createElement('button');
            button.className = 'code-copy-button';
            button.type = 'button';
            button.setAttribute('aria-label', 'Copy code to clipboard');

            button.innerHTML = `
                <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;

            button.addEventListener('click', function () {
                copyCode(pre, button);
            });

            // Insert button INSIDE wrapper (not inside <pre>)
            wrapper.appendChild(button);
        });
    }

    function copyCode(pre, button) {
        const code = pre.querySelector('code');
        if (!code) return;

        const text = code.textContent || code.innerText;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showCopied(button);
            }).catch(() => {
                fallbackCopy(text, button);
            });
        } else {
            fallbackCopy(text, button);
        }
    }

    function fallbackCopy(text, button) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            document.execCommand('copy');
            showCopied(button);
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }

        document.body.removeChild(textarea);
    }

    function showCopied(button) {
        button.classList.add('copied');
        setTimeout(() => {
            button.classList.remove('copied');
        }, 2000);
    }

    // Observe dynamic content (SPA-safe)
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(() => initCodeCopy());
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();