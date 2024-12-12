// State management
let showColors = true;
let isBlurred = false;

export function setShowColors(value) {
    showColors = value;
}

export function setIsBlurred(value) {
    isBlurred = value;
}

export const mathGroups = {
    functions: {
        color: '#2196F3', // Blue
        words: ['the fraction', 'the position', 'the velocity', 'the acceleration', 'inverse', 'the absolute value', 'over', 'square root', 'cube root', 'natural log', 'log base', 'choose', 'permute', 'derivative', 'with respect to', 'summation', 'the integral', 'from', 'limit as', 'approaches', 'from the', 'direction', 'limit', 'sine', 'cosine', 'tangent', 'secant', 'cosecant', 'cotangent', 'of']
    },
    operators: {
        color: '#F44336', // Red
        words: ['times', 'divided by', 'plus or minus', 'plus', 'minus', 'negative', 'positive', 'factorial', 'squared', 'cubed', 'to the', 'power']
    },
    comparisons: {
        color: '#9C27B0', // Purple
        words: ['is less than or equal to', 'is greater than or equal to', 'is less than', 'is greater than', 'equals', 'does not equal']
    },
    symbols: {
        color: '#4CAF50', // Green
        words: ['pi', 'infinity', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'theta', 'partial']
    }
};

function makeWordsClickable(text) {
    const words = text.split(' ').filter(word => word.length > 0);
    return words.map(word => {
        return `<span 
            class="clickable-word ${isBlurred ? 'word-blur' : ''}" 
            onclick="speakWordFromElement(this)"
        >${word}</span>`;
    }).join(' ');
}

export function highlightMathGroups(text) {
    const altTextDiv = document.getElementById('alt-text');
    if (!text || typeof text !== 'string') {
        altTextDiv.innerHTML = '';
        return;
    }

    if (!showColors) {
        altTextDiv.innerHTML = makeWordsClickable(text);
        return;
    }
    
    let words = text.split(' ').filter(word => word.length > 0);
    let processedIndices = new Set();
    let sections = [];
    
    // First pass: identify sections to color
    for (let i = 0; i < words.length; i++) {
        if (processedIndices.has(i)) continue;
        
        let matched = false;
        for (const [groupName, group] of Object.entries(mathGroups)) {
            for (const phrase of group.words) {
                const phraseWords = phrase.split(' ');
                if (i + phraseWords.length <= words.length) {
                    const candidatePhrase = words.slice(i, i + phraseWords.length).join(' ').toLowerCase();
                    if (candidatePhrase === phrase.toLowerCase()) {
                        sections.push({
                            startIndex: i,
                            endIndex: i + phraseWords.length - 1,
                            text: words.slice(i, i + phraseWords.length).join(' '),
                            color: group.color,
                            groupName: groupName
                        });
                        for (let j = i; j < i + phraseWords.length; j++) {
                            processedIndices.add(j);
                        }
                        matched = true;
                        break;
                    }
                }
            }
            if (matched) break;
        }
    }
    
    // Second pass: reconstruct text with colors and clickable words
    let result = [];
    words.forEach((word, index) => {
        const section = sections.find(s => s.startIndex <= index && s.endIndex >= index);
        if (section && section.startIndex === index) {
            // Start of a colored section
            result.push(`<span 
                class="clickable-word ${isBlurred ? 'word-blur' : ''}" 
                style="color: ${section.color}" 
                title="${section.groupName}"
                onclick="speakWordFromElement(this)"
            >${section.text}</span>`);
        } else if (!section && !processedIndices.has(index)) {
            // Individual word not part of any section
            result.push(`<span 
                class="clickable-word ${isBlurred ? 'word-blur' : ''}"
                onclick="speakWordFromElement(this)"
            >${word}</span>`);
        }
    });
    
    altTextDiv.innerHTML = result.join(' ');
}
