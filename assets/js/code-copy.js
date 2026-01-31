// Code Copy Functionality
// Adds a copy button to all code blocks

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCodeCopy);
    } else {
        initCodeCopy();
    }

    function initCodeCopy() {
        // Find all code blocks
        const codeBlocks = document.querySelectorAll('pre');

        codeBlocks.forEach((pre, index) => {
            // Don't add button if already exists
            if (pre.querySelector('.code-copy-button')) {
                return;
            }

            // Create copy button
            const button = document.createElement('button');
            button.className = 'code-copy-button';
            button.type = 'button';
            button.setAttribute('aria-label', 'Copy code to clipboard');
            button.innerHTML = `
                <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;

            // Add click event
            button.addEventListener('click', function() {
                copyCode(pre, button);
            });

            // Insert button into pre block
            pre.appendChild(button);
        });
    }

    function copyCode(pre, button) {
        // Get the code element
        const code = pre.querySelector('code');
        if (!code) return;

        // Get text content
        let text = code.textContent || code.innerText;

        // Copy to clipboard
        if (navigator.clipboard && window.isSecureContext) {
            // Modern async clipboard API
            navigator.clipboard.writeText(text).then(function() {
                showCopied(button);
            }).catch(function(err) {
                console.error('Failed to copy:', err);
                fallbackCopy(text, button);
            });
        } else {
            // Fallback for older browsers
            fallbackCopy(text, button);
        }
    }

    function fallbackCopy(text, button) {
        // Create temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.width = '1px';
        textarea.style.height = '1px';
        textarea.style.padding = '0';
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.boxShadow = 'none';
        textarea.style.background = 'transparent';

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopied(button);
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }

        document.body.removeChild(textarea);
    }

    function showCopied(button) {
        // Add copied class to show checkmark
        button.classList.add('copied');

        // Remove after 2 seconds
        setTimeout(function() {
            button.classList.remove('copied');
        }, 2000);
    }

    // Re-initialize on dynamic content changes (if needed)
    // This can be useful for SPA or dynamically loaded content
    if (typeof window.MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    initCodeCopy();
                }
            });
        });

        // Observe the document for added nodes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
