(function () {
    'use strict';

    const controls = document.querySelector('[data-tts-controls]');
    const content = document.querySelector('[data-tts-content]');

    if (!controls || !content) {
        return;
    }

    const playButton = controls.querySelector('[data-tts-play]');
    const stopButton = controls.querySelector('[data-tts-stop]');
    const playIcon = playButton.querySelector('.tts-icon-play');
    const pauseIcon = playButton.querySelector('.tts-icon-pause');
    const playLabel = playButton.querySelector('[data-tts-play-label]');
    const maxChunkLength = 220;
    let chunks = [];
    let chunkIndex = 0;
    let isReading = false;
    let selectedVoice = null;

    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
        playButton.disabled = true;
        stopButton.disabled = true;
        playButton.title = 'Text-to-speech is not supported by this browser.';
        return;
    }

    function chooseIndianVoice() {
        const voices = window.speechSynthesis.getVoices();
        const indianVoices = voices.filter(function (voice) {
            const language = voice.lang.toLowerCase();
            const name = voice.name.toLowerCase();
            return language === 'en-in' ||
                language.startsWith('en-in') ||
                name.includes('india');
        });
        const femaleVoiceHints = [
            'female', 'woman', 'zira', 'heera', 'raveena', 'veena',
            'lekha', 'priya', 'neerja', 'swara', 'aditi'
        ];
        const isFemaleVoice = function (voice) {
            const name = voice.name.toLowerCase();
            return femaleVoiceHints.some(function (hint) {
                return name.includes(hint);
            });
        };

        selectedVoice = indianVoices.find(isFemaleVoice) ||
            indianVoices[0] ||
            voices.find(function (voice) {
                return voice.lang.toLowerCase().startsWith('en');
            }) ||
            null;
    }

    function setButtonState(reading, paused) {
        isReading = reading;
        playButton.disabled = false;
        stopButton.disabled = !reading;
        playButton.classList.toggle('is-reading', reading);
        playButton.classList.toggle('is-paused', paused);
        playIcon.hidden = !(!reading || paused);
        pauseIcon.hidden = !reading || paused;
        playLabel.textContent = reading && !paused ? 'Pause' : 'Play';
        playButton.setAttribute('aria-label', reading && !paused ? 'Pause article' : 'Play article');
    }

    function splitText(text) {
        const words = text.trim().split(/\s+/);
        const result = [];
        let current = '';

        words.forEach(function (word) {
            const candidate = current ? current + ' ' + word : word;
            if (current && candidate.length > maxChunkLength) {
                result.push(current);
                current = word;
            } else {
                current = candidate;
            }
        });

        if (current) {
            result.push(current);
        }

        return result;
    }

    function finishReading() {
        chunks = [];
        chunkIndex = 0;
        setButtonState(false, false);
    }

    function speakNextChunk() {
        if (!isReading || chunkIndex >= chunks.length) {
            finishReading();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        } else {
            utterance.lang = 'en-IN';
        }
        utterance.onstart = function () {
            setButtonState(true, false);
        };
        utterance.onend = function () {
            chunkIndex += 1;
            speakNextChunk();
        };
        utterance.onerror = function (event) {
            // "interrupted" is expected when the user presses Stop.
            if (event.error !== 'interrupted' && event.error !== 'canceled') {
                console.error('Text-to-speech failed:', event.error);
            }
            finishReading();
        };
        window.speechSynthesis.speak(utterance);
    }

    function startReading() {
        const text = content.innerText || content.textContent || '';
        chunks = splitText(text);

        if (!chunks.length) {
            return;
        }

        window.speechSynthesis.cancel();
        chunkIndex = 0;
        setButtonState(true, false);
        speakNextChunk();
    }

    function stopReading() {
        chunks = [];
        chunkIndex = 0;
        window.speechSynthesis.cancel();
        setButtonState(false, false);
    }

    playButton.addEventListener('click', function () {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setButtonState(true, false);
            return;
        }
        if (isReading) {
            window.speechSynthesis.pause();
            setButtonState(true, true);
            return;
        }
        startReading();
    });

    stopButton.addEventListener('click', function () {
        if (isReading) {
            stopReading();
        }
    });

    window.speechSynthesis.addEventListener('voiceschanged', chooseIndianVoice);
    chooseIndianVoice();

    window.addEventListener('beforeunload', function () {
        window.speechSynthesis.cancel();
    });
})();
