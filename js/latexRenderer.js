export function renderLatexExpression(latex, element) {
    try {
        katex.render(latex, element, {
            throwOnError: false,
        });
    } catch (error) {
        element.textContent = 'Invalid LaTeX input.';
        console.error('Rendering Error:', error);
    }
}