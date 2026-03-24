document.addEventListener('DOMContentLoaded', () => {
    // Escenarios del Juego
    const scenarios = [
        {
            title: "Nivel 1: La Cuenta Suspendida",
            desc: "Se ha interceptado el siguiente correo electrónico. Encuentra 3 Banderas Rojas y 1 Verde (Elemento que no es sospechoso por sí solo).",
            type: "email",
            flagsNeeded: 3,
            html: `
            <div class="email-client glass-panel">
                <div class="email-header">
                    <div class="email-row clickable-flag" data-desc="El remitente simula ser Netflix, pero el dominio es '@netflıx-soporte-web.com'. Los correos legítimos vienen de '@netflix.com'.">
                        <strong>De:</strong> Soporte Netflix &lt;alerta@netflıx-soporte-web.com&gt;
                    </div>
                    <div class="email-row clickable-safe" data-safe="El campo 'Para' coincide con tu dirección. Esto es normal y no es un indicador de fraude por sí solo, aunque los atacantes pueden automatizarlo."><strong>Para:</strong> usuario@correo.com</div>
                    <div class="email-row clickable-safe" data-safe="La fecha actual es normal. Los sistemas de correo estampan la hora de recepción automáticamente."><strong>Fecha:</strong> Hoy, 11:42 AM</div>
                    <div class="email-row clickable-flag" data-desc="Falso sentido de urgencia ('Suspensión inmediata'). Táctica común para que actúes sin pensar.">
                        <strong>Asunto:</strong> ⚠️ URGENTE: Suspensión inmediata de su cuenta por falta de pago
                    </div>
                </div>
                <div class="email-body">
                    <p>Estimado/a cliente,</p>
                    <p>Lamentamos informarle que no hemos podido procesar su pago. Su cuenta será <strong class="clickable-flag" data-desc="Amenazan con 'suspensión en 24 horas' para causar pánico.">suspendida en 24 horas</strong> si no actualiza su información.</p>
                    <p>Ingrese al siguiente enlace para actualizar sus datos de pago de inmediato.</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="#" class="phishing-btn clickable-flag" data-desc="El botón no lleva a la página oficial. ¡Desconfía de botones que piden datos financieros!">ACTUALIZAR DATOS AHORA</a>
                    </div>
                </div>
            </div>
            `,
            feedback: `
                <p style="color: #10b981; font-weight: bold;">¡Excelente trabajo!</p>
                <p>Identificaste las tácticas: Remitente falso, urgencia y enlace engañoso.</p>
            `
        },
        {
            title: "Nivel 2: El SMS del Paquete",
            desc: "Has recibido un mensaje de texto. Encuentra 2 Banderas Rojas.",
            type: "sms",
            flagsNeeded: 2,
            html: `
            <div class="sms-client">
                <div class="sms-header">
                    <i class="fas fa-user-circle"></i> +34 600 123 456
                </div>
                <div class="sms-body">
                    <div class="sms-bubble clickable-flag" data-desc="Correos o empresas de paquetería reales suelen tener un nombre de remitente verificado (Ej: 'CORREOS'), no un número móvil aleatorio.">
                        CORREOS: Su <span class="clickable-safe" data-safe="Recibir mensajes sobre paquetes es muy común (todos compramos en internet). Por eso esta estafa tiene tanto éxito, se camufla con la cotidianidad.">paquete</span> no ha podido ser entregado el dia de hoy porque no se han pagado las <span class="clickable-flag" data-desc="Las empresas de paquetería nunca te piden pagar tasas aduaneras a través de un SMS con un enlace no oficial.">tasas de aduana (1,99€).</span>
                    </div>
                    <div class="sms-bubble sms-link clickable-flag" data-desc="El enlace HTTP (no HTTPS) o dominios raros acabados en '.tk' o '.xyz' (ej: correos-aduanas-pago.xyz) son casi siempre fraude.">
                        Para recibir su paquete mañana, pague aqui: http://correos-aduanas-pago.xyz/rastreo
                    </div>
                </div>
            </div>
            `,
            feedback: `
                <p style="color: #10b981; font-weight: bold;">¡Ojo Crítico!</p>
                <p>Las estafas por SMS (Smishing) buscan robar los datos de tu tarjeta mediante cobros ínfimos (1,99€).</p>
            `
        },
        {
            title: "Nivel 3: El Familiar en Apuros",
            desc: "Mensaje de WhatsApp interceptado. Encuentra 3 Banderas Rojas.",
            type: "whatsapp",
            flagsNeeded: 3,
            html: `
            <div class="whatsapp-client">
                <div class="wa-header">
                    <img src="https://ui-avatars.com/api/?name=Mama&background=random" alt="Avatar">
                    MAMÁ ❤️ (Número Desconocido)
                </div>
                <div class="wa-body">
                    <div class="wa-bubble receive clickable-flag" data-desc="Escriben desde un número desconocido alegando que 'su celular se malogró'.">
                        Hola hijo mi celular se cayo al agua y estoy usando el de un amigo prestado
                    </div>
                    <div class="wa-bubble receive clickable-flag" data-desc="Piden dinero de forma urgente para pagar un servicio.">
                        Tengo q pagar la luz urgente y no puedo entrar a mi app del banco, me prestas 300 mil?
                    </div>
                    <div class="wa-bubble receive clickable-safe" data-safe="El tono informal es normal en comunicaciones familiares. Los estafadores copian giros coloquiales para ganar confianza.">
                        Porfa ayudame que me cortan el servicio 
                    </div>
                    <div class="wa-bubble receive clickable-flag" data-desc="Ofrecen una cuenta a nombre de un tercero desconocido ('Luis Perez').">
                        Transfiereles a esta cuenta nequi porfa 3201234567 a nombre de Luis Perez
                    </div>
                    <div class="wa-bubble receive">
                        Te lo devuelvo mañana sin falta porfa avisame
                    </div>
                </div>
            </div>
            `,
            feedback: `
                <p style="color: #10b981; font-weight: bold;">¡Impecable!</p>
                <p>Esta es la estafa de "La maleta" o "El celular roto". Siempre llama al número original de tu familiar antes de transferir a desconocidos.</p>
            `
        }
    ];

    let currentLevel = 0;
    let flagsFound = 0;
    
    // Elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const victoryScreen = document.getElementById('victory-screen');
    
    const levelTitle = document.getElementById('level-title');
    const levelDesc = document.getElementById('level-desc');
    const scoreText = document.getElementById('score-text');
    const progressFill = document.getElementById('progress-fill');
    const scenarioContainer = document.getElementById('scenario-container');
    const feedbackPanel = document.getElementById('feedback-panel');
    const feedbackMessage = document.getElementById('feedback-message');
    const btnStart = document.getElementById('btn-start-game');
    const btnNext = document.getElementById('next-level-btn');
    const btnRestart = document.getElementById('btn-restart-game');

    // Events
    btnStart.addEventListener('click', startGame);
    btnNext.addEventListener('click', nextLevel);
    btnRestart.addEventListener('click', () => { currentLevel = 0; startGame(); });

    function startGame() {
        startScreen.classList.add('hidden');
        victoryScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        loadScenario();
    }

    function loadScenario() {
        const data = scenarios[currentLevel];
        flagsFound = 0;
        
        levelTitle.innerHTML = `<i class="fas fa-gamepad"></i> ${data.title}`;
        levelDesc.textContent = data.desc;
        feedbackPanel.classList.add('hidden');
        
        // Render scenario HTML
        scenarioContainer.innerHTML = data.html;
        
        updateScoreUI();

        // Attach flag events (Red flags)
        const flags = document.querySelectorAll('.clickable-flag');
        flags.forEach(flag => {
            flag.addEventListener('click', onFlagClick);
        });

        // Attach safe events (Green flags)
        const safeElements = document.querySelectorAll('.clickable-safe');
        safeElements.forEach(safeElem => {
            safeElem.addEventListener('click', onSafeClick);
        });
    }

    function onFlagClick(e) {
        if (this.classList.contains('flag-found')) return;

        this.classList.add('flag-found');
        flagsFound++;

        const desc = this.getAttribute('data-desc');
        showTooltip(this, desc, e, 'red');

        updateScoreUI();
    }

    function onSafeClick(e) {
        if (this.classList.contains('safe-found')) return;
        this.classList.add('safe-found');
        
        const desc = this.getAttribute('data-safe');
        showTooltip(this, desc, e, 'green');
    }

    function showTooltip(element, text, event, type) {
        // Eliminar cualquier tooltip abierto previamente en cualquier bandera
        document.querySelectorAll('.tooltip').forEach(t => t.remove());

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        
        if (type === 'red') {
            tooltip.style.border = '1px solid #ef4444';
            tooltip.innerHTML = `<strong style="color: #ef4444;"><i class="fas fa-exclamation-triangle"></i> ¡Peligro!</strong><br>${text}`;
        } else {
            tooltip.style.border = '1px solid #10b981';
            tooltip.innerHTML = `<strong style="color: #10b981;"><i class="fas fa-check-circle"></i> Elemento Cotidiano</strong><br>${text}`;
        }
        
        element.appendChild(tooltip);
        
        // Ensure tooltip stays within bounds
        const rect = tooltip.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            tooltip.style.left = 'auto';
            tooltip.style.right = '0';
        }
    }

    function updateScoreUI() {
        const totalFlags = scenarios[currentLevel].flagsNeeded;
        scoreText.textContent = `Banderas Rojas: ${flagsFound} / ${totalFlags}`;
        const percentage = Math.min((flagsFound / totalFlags) * 100, 100);
        progressFill.style.width = percentage + '%';

        if (flagsFound >= totalFlags && feedbackPanel.classList.contains('hidden')) {
            setTimeout(() => {
                showLevelFeedback();
            }, 800);
        }
    }

    function showLevelFeedback() {
        feedbackMessage.innerHTML = scenarios[currentLevel].feedback;
        feedbackPanel.classList.remove('hidden');
        
        // Change button text if it's the last level
        if (currentLevel === scenarios.length - 1) {
            btnNext.innerHTML = '<i class="fas fa-trophy"></i> Ver Resultados';
        } else {
            btnNext.innerHTML = '<i class="fas fa-arrow-right"></i> Siguiente Caso';
        }
        
        feedbackPanel.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    function nextLevel() {
        currentLevel++;
        if (currentLevel < scenarios.length) {
            loadScenario();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // End of Game
            gameScreen.classList.add('hidden');
            victoryScreen.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});
