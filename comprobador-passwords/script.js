// Real-time password strength meter using zxcvbn.js

document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password-input');
    const resultsDiv = document.getElementById('results');

    // Función para actualizar la barra en tiempo real
    function updateMeter(width, color, text) {
        const meter = document.getElementById('strength-meter');
        const feedback = document.getElementById('live-feedback');
        
        meter.style.width = width + '%';
        meter.style.backgroundColor = color;
        
        if (text) {
            feedback.innerHTML = `<span style="color: ${color};">${text}</span>`;
        } else {
            feedback.innerHTML = '';
        }
    }

    // Event listener para actualización en vivo
    passwordInput.addEventListener('input', function(e) {
        const password = e.target.value;
        resultsDiv.classList.remove('fade-in');
        setTimeout(() => resultsDiv.style.display = 'none', 400); // Ocultar analisis previo

        if (password.length === 0) {
            updateMeter(0, 'transparent', '');
        } else {
            const result = zxcvbn(password);
            const score = result.score; // 0 to 4
            let color, text;
            
            if (score <= 1) { color = '#ef4444'; text = 'Vulnerable'; } 
            else if (score === 2) { color = '#f59e0b'; text = 'Aceptable'; } 
            else if (score === 3) { color = '#10b981'; text = 'Fuerte'; } 
            else if (score === 4) { color = '#059669'; text = 'Irrompible'; }
            
            const width = (score === 0 && password.length > 0 ? 10 : (score / 4) * 100);
            updateMeter(width, color, text);
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
        // Lógica local para análisis sin depender de APIs pagas
        setTimeout(() => { // Simulamos un retraso de procesamiento para dar la sensación de "IA" pensando
            const result = zxcvbn(password);
            const score = result.score;
            
            // Generar variables de análisis simulando IA
            let analysis = "";
            let suggestions = []; // Excluimos los consejos en inglés por defecto de zxcvbn
            let improved_version = password;
            
            // Patrones comunes y altamente personalizados
            const hasNumSeq = /(123|234|345|456|567|678|789|890|098|987|876|765|654|543|432|321)/.test(password);
            const hasDates = /(19|20)\d{2}/.test(password);
            const hasQwe = /(qwe|asd|zxc|wsx|qaz)/i.test(password);
            const isNameLike = /^[A-Z][a-z]+$/.test(password);
            
            if (score <= 1) {
                analysis = "He analizado tu contraseña y debo decirte que es demasiado predecible. Un ataque automatizado (fuerza bruta) la descubriría en cuestión de milisegundos.";
                if (hasNumSeq) suggestions.push("He detectado que usas una secuencia numérica (ej. 123). ¡Es lo primero que prueban los atacantes!");
                if (hasDates) suggestions.push("Usar años o fechas (ej. 1990, 2024) hace que tu clave sea fácil si alguien revisa tus redes sociales.");
                if (hasQwe) suggestions.push("Los patrones obvios del teclado como 'qwe' o 'asd' son extremadamente inseguros.");
                if (isNameLike) suggestions.push("Si estás usando tu nombre o el de una persona/mascota, cámbialo. Los diccionarios están llenos de nombres propios.");
            } else if (score === 2) {
                analysis = "Tu contraseña tiene una seguridad media. Has evitado lo más básico, pero con un ataque de diccionario enfocado podría verse comprometida.";
                if (password.length < 10) suggestions.push("La longitud es fundamental: intenta que tenga al menos 12 caracteres.");
            } else if (score >= 3) {
                analysis = "¡Excelente trabajo! Has construido una contraseña robusta. Los atacantes la tendrían muy difícil para adivinarla.";
            }
            
            // Generador de contraseña mejorada (Leetspeak y sufijos) si la contraseña es débil
            if (score < 3) {
                const replacements = { 'a': '@', 'e': '3', 'i': '1', 'o': '0', 's': '$' };
                let improved = password.toLowerCase().replace(/[aeios]/gi, m => replacements[m] || replacements[m.toLowerCase()]);
                
                if (!/[A-Z]/.test(improved) && improved.length > 0) {
                    improved = improved.charAt(0).toUpperCase() + improved.slice(1);
                }
                if (!/[!@#$%^&*_-]/.test(improved)) improved += "!";
                if (!/\d/.test(improved)) improved += "24"; 
                
                // Reforzar longitudes cortas con frases
                if (improved.length < 12) {
                    const suffixes = ["_Segura", "-Fuerte", "_Priv"];
                    improved += suffixes[Math.floor(Math.random() * suffixes.length)];
                }
                improved_version = improved;
            } else {
                improved_version = "🎉 ¡No es necesaria, tu idea original ya es suficientemente fuerte!";
            }
            
            if (suggestions.length === 0) suggestions.push("¡No hay consejos, todo se ve muy bien!");

            resultsDiv.innerHTML = `
                <h3>Análisis de Alejandro (Tu IA Local):</h3>
                <p>${analysis}</p>
                <h3>Nivel de Fortaleza:</h3>
                <p>${score}/4 ${score >= 3 ? '✅' : '⚠️'}</p>
                <h3>Consejos Personalizados:</h3>
                <p>${suggestions.join(' ')}</p>
                <h3>Sugerencia de Mejora (Basada en tu idea):</h3>
                <p style="font-family: monospace; font-size: 1.2rem; background: #e0e0e0; color: #333; padding: 10px; border-radius: 5px; display: inline-block;">${improved_version}</p>
                <p class="motivational">Recuerda: ¡Una contraseña fuerte es tu primera línea de defensa digital!</p>
            `;
            resultsDiv.style.display = ''; // Remove inline override
            resultsDiv.classList.add('fade-in');
            analyzeBtn.classList.remove('loading');
        }, 600);
    });


});