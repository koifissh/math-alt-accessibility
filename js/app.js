import { renderLatexExpression } from './latexRenderer.js';
import { generateAltText } from './altTextGenerator.js';
import { initTextToSpeech } from './texttospeech.js';
import { highlightMathGroups, setShowColors, setIsBlurred } from './highlightGroups.js';

let isBlurred = false;
let showColors = true;


window.speakWordFromElement = function(element) {
    const word = element.textContent;
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
};

function initializeAccessibilityToggles() {
    const blurToggle = document.getElementById('blur-toggle');
    const colorToggle = document.getElementById('color-toggle');
    
    if (blurToggle && colorToggle) {
        blurToggle.addEventListener('click', toggleBlur);
        colorToggle.addEventListener('click', toggleColors);
    }
}

function toggleBlur() {
    isBlurred = !isBlurred;
    const blurToggle = document.getElementById('blur-toggle');
    blurToggle.innerHTML = isBlurred ? '👁️‍🗨️ Clear' : '👁️ Blur Words';
    setIsBlurred(isBlurred);
    updateAltTextDisplay();
}

function toggleColors() {
    showColors = !showColors;
    const colorToggle = document.getElementById('color-toggle');
    colorToggle.innerHTML = showColors ? '🎨 Colors' : '⬜ No Colors';
    setShowColors(showColors);
    updateAltTextDisplay();
}

function updateAltTextDisplay(text) {
    if (text === undefined) {
        const altTextDiv = document.getElementById('alt-text');
        text = altTextDiv.textContent;
    }
    highlightMathGroups(text);
}





// Theme toggle functionality
function initializeTheme() {
    // Check for saved user preference, first in localStorage, then in system setting
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleButton(savedTheme);
}

function updateThemeToggleButton(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleButton(newTheme);
}

// Initialize theme
initializeTheme();

// Add event listener to theme toggle button
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Create shortcut buttons organized by category
const shortcuts = {
    arithmetic: [
        { label: '√', latex: '\\sqrt{}', cursorOffset: -1 },
        { label: 'x²', latex: '^2', cursorOffset: 0 },
        { label: 'frac', latex: '\\frac{}{}', cursorOffset: -2 },
        { label: '×', latex: '\\times', cursorOffset: 0 },
        { label: '÷', latex: '\\div', cursorOffset: 0 },
        { label: '≠', latex: '\\neq', cursorOffset: 0 },
        { label: '≤', latex: '\\leq', cursorOffset: 0 },
        { label: '≥', latex: '\\geq', cursorOffset: 0 },
        { label: '+/-', latex: '\\pm', cursorOffset: 0 },
        { label: '-', latex: '-', cursorOffset: 0 },
        { label: '+', latex: '+', cursorOffset: 0 }
    ],
    trigonometry: [
        { label: 'sin', latex: '\\sin', cursorOffset: 0 },
        { label: 'cos', latex: '\\cos', cursorOffset: 0 },
        { label: 'tan', latex: '\\tan', cursorOffset: 0 },
        { label: 'csc', latex: '\\csc', cursorOffset: 0 },
        { label: 'sec', latex: '\\sec', cursorOffset: 0 },
        { label: 'cot', latex: '\\cot', cursorOffset: 0 },
        { label: 'sin⁻¹', latex: '\\arcsin', cursorOffset: 0 },
        { label: 'cos⁻¹', latex: '\\arccos', cursorOffset: 0 },
        { label: 'tan⁻¹', latex: '\\arctan', cursorOffset: 0 }
    ],
    calculus: [
        { label: '∫', latex: '\\int', cursorOffset: 0 },
        { label: '∫_a^b', latex: '\\int_{a}^{b}', cursorOffset: 0 },
        { label: '∂', latex: '\\partial', cursorOffset: 0 },
        { label: 'lim', latex: '\\lim_{x \\to }', cursorOffset: -1 },
        { label: '∑', latex: '\\sum_{n=1}^{\\infty}', cursorOffset: 0 },
        { label: 'd/dx', latex: '\\frac{d}{dx}', cursorOffset: 0 },
        { label: '∞', latex: '\\infty', cursorOffset: 0 }
    ],
    greek: [
        { label: 'α', latex: '\\alpha', cursorOffset: 0 },
        { label: 'β', latex: '\\beta', cursorOffset: 0 },
        { label: 'γ', latex: '\\gamma', cursorOffset: 0 },
        { label: 'Γ', latex: '\\Gamma', cursorOffset: 0 },
        { label: 'π', latex: '\\pi', cursorOffset: 0 },
        { label: 'θ', latex: '\\theta', cursorOffset: 0 },
        { label: 'Σ', latex: '\\Sigma', cursorOffset: 0 }
    ]
};

// Create and add shortcut sections to the page
const shortcutsContainer = document.querySelector('.shortcuts-container');

// Create a section for each category
Object.entries(shortcuts).forEach(([category, shortcutList]) => {
    const section = document.createElement('div');
    section.className = 'shortcut-section';
    
    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    sectionTitle.className = 'shortcut-section-title';
    section.appendChild(sectionTitle);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'shortcut-buttons';

    shortcutList.forEach(shortcut => {
        const button = document.createElement('button');
        button.textContent = shortcut.label;
        button.className = 'shortcut-btn';
        button.setAttribute('type', 'button');
        button.setAttribute('title', shortcut.latex); // Add tooltip showing LaTeX command
        button.addEventListener('click', () => insertShortcut(shortcut.latex, shortcut.cursorOffset));
        buttonContainer.appendChild(button);
    });

    section.appendChild(buttonContainer);
    shortcutsContainer.appendChild(section);
});

// Function to insert LaTeX at cursor position
function insertShortcut(latex, cursorOffset) {
    const latexInput = document.getElementById('latex-input');
    const start = latexInput.selectionStart;
    const end = latexInput.selectionEnd;
    const currentValue = latexInput.value;
    
    // Insert the LaTeX at cursor position
    latexInput.value = currentValue.substring(0, start) + 
                      latex + 
                      currentValue.substring(end);
    
    // Set cursor position
    const newPosition = start + latex.length + cursorOffset;
    latexInput.focus();
    latexInput.setSelectionRange(newPosition, newPosition);
}

// Event listener for the generate button
document.getElementById('generate-btn').addEventListener('click', () => {
    const latexInput = document.getElementById('latex-input').value;
    const renderedMath = document.getElementById('rendered-math');
    const altText = document.getElementById('alt-text');

    if (!latexInput.trim()) {
        renderedMath.textContent = 'Please enter LaTeX expression.';
        altText.textContent = '';
        return;
    }

    try {
        renderLatexExpression(latexInput, renderedMath);
        const generatedAltText = generateAltText(latexInput); 
        if (generatedAltText) {
            updateAltTextDisplay(generatedAltText);
        } else {
            altText.textContent = 'Error generating alt text.';
        }
    } catch (error) {
        renderedMath.textContent = 'Error rendering LaTeX.';
        altText.textContent = 'Error generating alt text.';
        console.error(error);
    }
});

// Initialize text-to-speech functionality
initTextToSpeech();




function updateFontFamily(selectedFont) {
    // Create the font-family string with fallbacks
    let fontFamily;
    switch (selectedFont) {
        case 'OpenDyslexic':
            fontFamily = 'OpenDyslexic, Arial, sans-serif';
            break;
        case 'Comic Sans MS':
            fontFamily = '"Comic Sans MS", cursive, sans-serif';
            break;
        case 'Verdana':
            fontFamily = 'Verdana, Arial, sans-serif';
            break;
        case 'Arial':
        default:
            fontFamily = 'Arial, sans-serif';
            break;
    }

    // Update root CSS variable
    document.documentElement.style.setProperty('--font-family', fontFamily);
    
    // Update all shortcut buttons directly
    const shortcutButtons = document.querySelectorAll('.shortcut-btn');
    shortcutButtons.forEach(button => {
        button.style.fontFamily = fontFamily;
    });
}

function initializeFontMenu() {
    const fontToggle = document.getElementById('font-toggle');
    const fontMenu = document.getElementById('font-menu');
    
    if (!fontToggle || !fontMenu) {
        console.error('Font menu elements not found!');
        return;
    }
    
    fontToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        fontMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!fontToggle.contains(e.target) && !fontMenu.contains(e.target)) {
            fontMenu.classList.add('hidden');
        }
    });

    // Handle font selection
    fontMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const selectedFont = e.target.dataset.font;
            updateFontFamily(selectedFont);
            localStorage.setItem('preferred-font', selectedFont);
            fontMenu.classList.add('hidden');
        }
    });

    // Load saved font preference
    const savedFont = localStorage.getItem('preferred-font');
    if (savedFont) {
        updateFontFamily(savedFont);
    }
}

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFontMenu();
    initializeAccessibilityToggles();
});