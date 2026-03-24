// Real-time password strength meter using zxcvbn.js

document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password-input');
    const resultsDiv = document.getElementById('results');

    // Function to update the strength meter
    function updateMeter(width, color, text) {
        let style = document.getElementById('strength-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'strength-style';
            document.head.appendChild(style);
        }
        style.textContent = `#strength-meter::before { width: ${width}%; background: ${color} !important; }`;
        resultsDiv.innerHTML = text ? `Seguridad actual: ${text}` : '';
    }

    // Event listener for password input
    passwordInput.addEventListener('input', function(e) {
        const password = e.target.value;
        if (password.length === 0) {
            updateMeter(0, 'transparent', '');
            resultsDiv.innerHTML = '';
            resultsDiv.classList.remove('fade-in');
        } else {
            const result = zxcvbn(password);
            const score = result.score; // 0 to 4
            let color, text;
            if (score <= 1) {
                color = 'red';
                text = 'Débil';
            } else if (score === 2) {
                color = 'yellow';
                text = 'Media';
            } else if (score === 3) {
                color = 'green';
                text = 'Fuerte';
            } else if (score === 4) {
                color = 'limegreen';
                text = 'Ideal';
            }
            const width = (score / 4) * 100;
            updateMeter(width, color, text);
            resultsDiv.classList.add('fade-in');
        }
    });

    // Event listener for analyze button
    const analyzeBtn = document.getElementById('analyze-btn');
    analyzeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const password = passwordInput.value;
        if (!password.trim()) {
            resultsDiv.innerHTML = '<p>Por favor, ingresa una contraseña para analizar.</p>';
            resultsDiv.classList.add('fade-in');
            return;
        }
        analyzeBtn.classList.add('loading');
        fetch('/analyze-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            resultsDiv.innerHTML = `
                <h3>Análisis de IA:</h3>
                <p>${data.analysis}</p>
                <h3>Fuerza de la Contraseña:</h3>
                <p>${data.strength}/4</p>
                <h3>Consejos:</h3>
                <p>${data.feedback.suggestions ? data.feedback.suggestions.join(', ') : 'Ninguno'}</p>
                <h3>Versión Mejorada:</h3>
                <p>${data.improved_version || 'No disponible'}</p>
                <p class="motivational">¡Recuerda, una contraseña fuerte es tu primera línea de defensa!</p>
            `;
            resultsDiv.classList.add('fade-in');
        })
        .catch(error => {
            resultsDiv.innerHTML = '<p>Error al analizar la contraseña. Por favor, inténtalo de nuevo.</p>';
            console.error('Error:', error);
            resultsDiv.classList.add('fade-in');
        })
        .finally(() => {
            analyzeBtn.classList.remove('loading');
        });
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '☀️ Light Mode';
        } else {
            themeToggle.innerHTML = '🌙 Dark Mode';
        }
    });
});