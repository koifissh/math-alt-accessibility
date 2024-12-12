// texttospeech.js
import { highlightMathGroups } from './highlightGroups.js';

let isSpeaking = false;
const synth = window.speechSynthesis;
let currentWordIndex = 0;
let originalFormattedText = '';

function highlightWord(text, index) {
    const words = text.split(' ');
    const before = words.slice(0, index).join(' ');
    const current = words[index];
    const after = words.slice(index + 1).join(' ');
    
    const altTextDiv = document.getElementById('alt-text');
    // Store the colored text before starting speech
    if (index === 0) {
        originalFormattedText = altTextDiv.innerHTML;
    }

    altTextDiv.innerHTML = `${before} <span class="highlight">${current}</span> ${after}`;
}

function resetHighlighting(text) {
    const altTextDiv = document.getElementById('alt-text');
    // Restore the original colored text
    if (originalFormattedText) {
        altTextDiv.innerHTML = originalFormattedText;
    } else {
        highlightMathGroups(text);
    }
}

function updateSpeakButtonState() {
    const speakBtn = document.getElementById('speak-btn');
    speakBtn.innerHTML = isSpeaking ? '🔊 Stop' : '🔊 Speak';
    speakBtn.setAttribute('aria-label', isSpeaking ? 'Stop speaking' : 'Speak alt text');
}

function speakText(text) {
    if (isSpeaking) {
        synth.cancel();
        isSpeaking = false;
        resetHighlighting(text);
        updateSpeakButtonState();
        return;
    }

    const words = text.split(' ');
    currentWordIndex = 0;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Handle word boundaries
    utterance.onboundary = (event) => {
        if (event.name === 'word') {
            currentWordIndex = Math.min(currentWordIndex + 1, words.length - 1);
            highlightWord(text, currentWordIndex);
        }
    };

    utterance.onend = () => {
        isSpeaking = false;
        resetHighlighting(text);
        updateSpeakButtonState();
    };

    utterance.onstart = () => {
        highlightWord(text, 0);
    };
    
    isSpeaking = true;
    updateSpeakButtonState();
    synth.speak(utterance);
}

function initTextToSpeech() {
    document.getElementById('speak-btn').addEventListener('click', () => {
        const altText = document.getElementById('alt-text').textContent;
        speakText(altText);
    });
}

export { initTextToSpeech, speakText };