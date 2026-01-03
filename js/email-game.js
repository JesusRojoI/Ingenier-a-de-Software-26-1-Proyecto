// js/email-game.js - Juego de Phishing por Email

class EmailGame {
    constructor() {
        this.score = 1000;
        this.timeLeft = 180; // 3 minutos
        this.thiefSuspicion = 0;
        this.gameActive = false;
        this.timerInterval = null;
        this.currentDialogueIndex = 0;
        this.isTalking = false;
        this.currentEmail = null;
        this.emailsAnalyzed = 0;

        // Para "tentaciones" y posibilidad real de perder
        this.mistakesCount = 0;

        // Lock para evitar doble acción mientras mostramos feedback/transición
        this.feedbackLock = false;

        // Diálogo de introducción del ladrón
        this.introductionDialogue = [
            "¡Je je je! Bienvenido al mundo del email phishing...",
            "Soy el maestro de la suplantación por correo electrónico.",
            "Creo emails tan convincentes que incluso los más cautelosos caen...",
            "¿Podrás distinguir mis creaciones de los correos legítimos?",
            "Prepárate para analizar mis mejores obras de arte fraudulentas. ¡Comencemos!"
        ];

        // Estrategias de phishing por email
        this.emailStrategies = [
            {
                type: 'alerta_bancaria',
                subject: '🚨 ALERTA DE SEGURIDAD - Acceso No Autorizado Detectado',
                sender: 'Soporte Seguridad <soporte@banco-seguro.online>',
                content: `Estimado cliente,

Nuestro sistema ha detectado actividad sospechosa en su cuenta bancaria. Se ha intentado acceder desde una ubicación no reconocida (IP: 192.168.89.123).

🔒 Para proteger sus fondos, debe VERIFICAR SU IDENTIDAD inmediatamente:

👉 https://banco-seguro.verificar-cuenta.com/secure-login

Si no completa la verificación en las próximas 2 horas, su cuenta será suspendida temporalmente por seguridad.

Atentamente,
Departamento de Seguridad
Banco Seguro Internacional`,
                suspiciousElements: [
                    'Dominio sospechoso: banco-seguro.online',
                    'URL acortada o modificada',
                    'Tono de urgencia exagerado',
                    'Falta de información específica de la cuenta'
                ]
            },
            {
                type: 'oferta_trabajo',
                subject: '💰 OFERTA EXCLUSIVA: Gane $5,000 USD Trabajando Desde Casa',
                sender: 'Recursos Humanos <contrataciones@trabajo-remoto.net>',
                content: `¡FELICITACIONES!

Su perfil ha sido seleccionado para una posición exclusiva de trabajo desde casa.

📋 Detalles de la Oportunidad:
- Salario: $5,000 USD mensuales
- Horario flexible
- Sin experiencia previa requerida
- Pago semanal garantizado

Para proceder, necesitamos que complete su registro enviando:
1. Copia de su identificación
2. Número de cuenta bancaria
3. Número de teléfono

📧 Responda este email con los documentos adjuntos.

¡No pierda esta oportunidad única!
Equipo de Contrataciones`,
                suspiciousElements: [
                    'Salario demasiado alto sin experiencia',
                    'Solicitud de datos bancarios por email',
                    'Dominio no profesional: trabajo-remoto.net',
                    'Falta de información específica de la empresa'
                ]
            },
            {
                type: 'factura_falsa',
                subject: '⚠️ FACTURA PENDIENTE #INV-7842 - Vencimiento Hoy',
                sender: 'Departamento de Cobranza <cobranza@servicios-premium.xyz>',
                content: `FACTURA DE SERVICIOS PENDIENTE

Número de Factura: INV-7842
Cliente: [Su Nombre]
Servicio: Suscripción Premium Anual
Total Pendiente: $149.99 USD
Fecha de Vencimiento: HOY

Su servicio será SUSPENDIDO en 24 horas si no realiza el pago.

📎 Adjunto encontrará la factura detallada: factura_INV-7842.zip

Para evitar la suspensión, realice el pago inmediatamente o contacte a nuestro departamento de soporte.

Atentamente,
Departamento de Cobranza`,
                suspiciousElements: [
                    'Extensión de archivo .zip sospechosa',
                    'Dominio no profesional: servicios-premium.xyz',
                    'Falta de información específica del servicio',
                    'Tono amenazante y urgente'
                ]
            },
            {
                type: 'premio_ganado',
                subject: '🎉 ¡FELICIDADES! Ha Ganado el iPhone 15 Pro MAX',
                sender: 'Premios Internacionales <premios@concursos-mundiales.com>',
                content: `¡NOTICIA INCREÍBLE!

Usted ha sido seleccionado como el GANADOR del sorteo internacional.

🎁 PREMIO: iPhone 15 Pro MAX 512GB
💰 Valor: $1,599 USD

Para reclamar su premio, debe:
1. Confirmar su dirección de envío
2. Pagar los gastos de envío ($49.99 USD)
3. Verificar su identidad

⏰ ESTA OFERTA ES VÁLIDA POR 24 HORAS

Responda este email con:
- Nombre completo
- Dirección completa
- Número de teléfono
- Método de pago preferido

¡Felicidades nuevamente!
Equipo de Premios Internacionales`,
                suspiciousElements: [
                    'Solicitud de pago por premio "gratuito"',
                    'Tiempo límite artificial',
                    'Dominio sospechoso: concursos-mundiales.com',
                    'Falta de información del sorteo específico'
                ]
            },
            {
                type: 'actualizacion_cuenta',
                subject: 'Actualización Requerida de Políticas de Seguridad',
                sender: 'Soporte Técnico <soporte@netflix-premium.support>',
                content: `Actualización de Seguridad Requerida

Estimado usuario,

Debido a actualizaciones en nuestras políticas de seguridad, necesitamos que verifique la información de su cuenta.

🔐 Por favor, actualice sus datos ingresando a:

https://netflix-premium.support/account-verification

Una vez que ingrese, se le pedirá:
- Correo electrónico actual
- Contraseña actual
- Nueva contraseña
- Método de pago

Si no actualiza su información en 48 horas, su cuenta podría ser restringida.

Gracias por su cooperación.
Equipo de Soporte Netflix`,
                suspiciousElements: [
                    'Dominio falso: netflix-premium.support',
                    'Solicitud de contraseña actual',
                    'URL que no coincide con el servicio oficial',
                    'Amenaza de restricción de cuenta'
                ]
            }
        ];

        // Catálogo base (opción A) — luego se filtra por tipo de email
        this.responseCatalog = {
            link: {
                safe: [
                    { text: "Verificar dominio / remitente oficial", action: "verifySender", points: +120, suspicion: +15, risk: "low" },
                    { text: "Revisar URL antes de abrir", action: "inspectLink", points: +80, suspicion: +10, risk: "low" },
                    { text: "Reportar como phishing", action: "reportPhishing", points: +120, suspicion: +15, risk: "low" },
                    { text: "Marcar como spam", action: "markSpam", points: +80, suspicion: +10, risk: "low" }
                ],
                temptations: [
                    { text: "Hacer clic en enlace", action: "clickLink", points: -140, suspicion: +4, risk: "high" }
                ]
            },
            attachment: {
                safe: [
                    { text: "Eliminar email", action: "deleteEmail", points: +100, suspicion: +12, risk: "low" },
                    { text: "No abrir adjunto", action: "ignoreAttachment", points: +80, suspicion: +10, risk: "low" },
                    { text: "Escanear adjunto (simulado)", action: "scanAttachment", points: +120, suspicion: +15, risk: "low" },
                    { text: "Reportar como phishing", action: "reportPhishing", points: +120, suspicion: +15, risk: "low" }
                ],
                temptations: [
                    { text: "Descargar archivo adjunto", action: "downloadAttachment", points: -160, suspicion: +3, risk: "high" }
                ]
            },
            data: {
                safe: [
                    { text: "No responder y contactar canal oficial", action: "contactRealService", points: +140, suspicion: +18, risk: "low" },
                    { text: "No comparto datos por email", action: "refuseData", points: +120, suspicion: +15, risk: "low" },
                    { text: "Reportar como phishing", action: "reportPhishing", points: +120, suspicion: +15, risk: "low" },
                    { text: "Marcar como spam", action: "markSpam", points: +80, suspicion: +10, risk: "low" }
                ],
                temptations: [
                    { text: "Responder con datos", action: "replyWithData", points: -220, suspicion: +2, risk: "high" }
                ]
            },
            generic: {
                safe: [
                    { text: "Marcar como spam", action: "markSpam", points: +80, suspicion: +10, risk: "low" },
                    { text: "Reportar como phishing", action: "reportPhishing", points: +120, suspicion: +15, risk: "low" },
                    { text: "Eliminar email", action: "deleteEmail", points: +100, suspicion: +12, risk: "low" },
                    { text: "Verificar remitente oficial", action: "verifySender", points: +120, suspicion: +15, risk: "low" }
                ],
                temptations: [
                    { text: "Responder con datos", action: "replyWithData", points: -220, suspicion: +2, risk: "high" }
                ]
            }
        };

        this.injectFeedbackStyles();
        this.initializeGame();
    }

    initializeGame() {
        this.setupEventListeners();
        this.startIntroduction();

        // Al iniciar, NO hay email seleccionado => deshabilitar acciones
        this.setActionsEnabled(false);
        this.hideQuickResponses(); // Para que no aparezcan sin abrir email
    }

    setupEventListeners() {
        document.getElementById('speechBubble').addEventListener('click', () => this.nextDialogue());
    }

    startIntroduction() {
        document.getElementById('gameContainer').classList.add('dimmed');
        this.showDialogueMessage(this.introductionDialogue[0]);
    }

    showDialogueMessage(message) {
        if (this.isTalking) return;

        this.isTalking = true;
        const bubble = document.getElementById('speechBubble');
        const messageElement = document.getElementById('thiefMessage');
        const head = document.getElementById('thiefHead');

        head.classList.add('talking');

        setTimeout(() => {
            messageElement.textContent = message;
            bubble.classList.add('show');
            this.isTalking = false;
        }, 500);
    }

    nextDialogue() {
        if (this.isTalking) return;

        const bubble = document.getElementById('speechBubble');
        const head = document.getElementById('thiefHead');

        bubble.classList.remove('show');
        head.classList.remove('talking');

        setTimeout(() => {
            this.currentDialogueIndex++;

            if (this.currentDialogueIndex < this.introductionDialogue.length) {
                this.showDialogueMessage(this.introductionDialogue[this.currentDialogueIndex]);
            } else {
                this.endIntroduction();
            }
        }, 300);
    }

    endIntroduction() {
        document.getElementById('gameContainer').classList.remove('dimmed');
        const bubble = document.getElementById('speechBubble');
        bubble.classList.remove('show');

        document.getElementById('gameMain').style.display = 'flex';
        setTimeout(() => this.startGame(), 1000);
    }

    startGame() {
        this.gameActive = true;
        this.startTimer();
        this.generateEmail();

        // HUD inicial
        this.updateScoreDisplay();
        this.updateSuspicionDisplay();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            if (this.timeLeft <= 0) {
                this.endGame('timeout');
            }

            // Generar nuevo email periódicamente
            if (this.timeLeft % 30 === 0 && this.gameActive && this.emailsAnalyzed < 8) {
                setTimeout(() => this.generateEmail(), 2000);
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const el = document.getElementById('timerDisplay');
        el.textContent = `⏱️ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (this.timeLeft < 30) {
            el.classList.add('time-warning');
        }
    }

    // =========================
    // EMAILS
    // =========================

    generateEmail() {
        if (!this.gameActive) return;

        const randomStrategy = this.emailStrategies[Math.floor(Math.random() * this.emailStrategies.length)];
        this.currentEmail = { ...randomStrategy, id: Date.now() };

        this.addEmailToList(this.currentEmail);
    }

    addEmailToList(email) {
        const emailList = document.getElementById('emailList');
        const emailItem = document.createElement('div');
        emailItem.className = 'email-item';
        emailItem.dataset.emailId = email.id;

        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        emailItem.innerHTML = `
            <div class="email-sender">${email.sender}</div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-preview">${email.content.substring(0, 100)}...</div>
            <div class="email-time">${timeString}</div>
        `;

        emailItem.addEventListener('click', () => this.openEmail(email));
        emailList.appendChild(emailItem);
        emailList.scrollTop = emailList.scrollHeight;
    }

    openEmail(email) {
        if (!this.gameActive) return;

        this.currentEmail = email;
        const emailView = document.getElementById('emailView');
        const emailList = document.getElementById('emailList');

        // UI: cambiar a vista email
        emailList.style.display = 'none';
        emailView.style.display = 'block';

        // IMPORTANTE: NO mostramos suspiciousElements aquí (tu requerimiento)
        emailView.innerHTML = `
            <div class="email-header">
                <div class="email-from">${email.sender}</div>
                <div class="email-subject-view">${email.subject}</div>
            </div>

            <div class="email-body">${this.formatEmailContent(email.content)}</div>

            <!-- Slot para feedback post-acción (aparece DESPUÉS de responder) -->
            <div id="postActionFeedbackSlot"></div>
        `;

        // Ahora sí: habilitar acciones y generar 3 respuestas adaptadas al email
        this.setActionsEnabled(true);
        this.generateSmartResponsesForEmail(email);
        this.showQuickResponses();
    }

    formatEmailContent(content) {
        return content
            .replace(/\n/g, '<br>')
            .replace(/(https?:\/\/[^\s<]+)/g, '<span class="suspicious-link" onclick="emailGame.handleInlineLinkClick(event)">$1</span>')
            .replace(/(\.zip|\.exe|\.scr)/gi, '<span class="suspicious-attachment" onclick="emailGame.handleInlineAttachmentClick(event)">$1</span>');
    }

    // Clicks inline dentro del body (solo si el usuario decide tocarlo)
    handleInlineLinkClick(e) {
        if (e) e.stopPropagation();
        this.handlePlayerAction('clickLink');
    }

    handleInlineAttachmentClick(e) {
        if (e) e.stopPropagation();
        this.handlePlayerAction('downloadAttachment');
    }

    // =========================
    // RESPUESTAS (3 opciones)
    // =========================

    detectEmailKind(email) {
        const text = `${email.subject}\n${email.sender}\n${email.content}`.toLowerCase();

        const hasLink = /https?:\/\/\S+/.test(text);
        const hasAttachment = /\.(zip|exe|scr)\b/.test(text) || text.includes('adjunto') || text.includes('archivo adjunto');
        const asksData =
            text.includes('contraseña') ||
            text.includes('password') ||
            text.includes('cvv') ||
            text.includes('nip') ||
            text.includes('clabe') ||
            text.includes('número de cuenta') ||
            text.includes('numero de cuenta') ||
            text.includes('método de pago') ||
            text.includes('metodo de pago');

        // Prioridad: data > attachment > link > generic
        if (asksData) return 'data';
        if (hasAttachment) return 'attachment';
        if (hasLink) return 'link';
        return 'generic';
    }

    generateSmartResponsesForEmail(email) {
        const container = document.getElementById('quickResponses');
        if (!container) return;

        container.innerHTML = '';

        // Si no hay email abierto, no mostramos nada
        if (!this.currentEmail) {
            this.hideQuickResponses();
            return;
        }

        const kind = this.detectEmailKind(email);
        const catalog = this.responseCatalog[kind] || this.responseCatalog.generic;

        // Queremos EXACTAMENTE 3:
        // - 1 buena (safe fuerte)
        // - 1 neutral (safe suave)
        // - 1 mala (temptation)
        const safeSorted = [...catalog.safe].sort((a, b) => (b.points + b.suspicion) - (a.points + a.suspicion));
        const good = safeSorted[0] || catalog.safe[0];

        // Neutral: intentar agarrar una safe distinta con menor impacto
        const neutralCandidates = safeSorted.filter(x => x.action !== good.action);
        const neutral = neutralCandidates.length ? neutralCandidates[neutralCandidates.length - 1] : good;

        // Mala: tentación. Si el jugador ya cometió errores, dejamos la mala siempre.
        // Si no, igual debe existir (requisito tuyo: que se pueda perder).
        const bad = (catalog.temptations && catalog.temptations.length)
            ? catalog.temptations[Math.floor(Math.random() * catalog.temptations.length)]
            : { text: "Responder con datos", action: "replyWithData", points: -220, suspicion: +2, risk: "high" };

        // Armar y mezclar un poco el orden (para que no se memorice)
        const options = [good, neutral, bad].sort(() => 0.5 - Math.random());

        options.forEach(opt => {
            const button = document.createElement('button');
            button.className = `response-btn ${opt.risk}-risk`;
            button.textContent = opt.text;
            button.onclick = () => this.handlePlayerAction(opt.action);
            container.appendChild(button);
        });
    }

    hideQuickResponses() {
        const container = document.getElementById('quickResponses');
        if (container) container.innerHTML = '';
    }

    showQuickResponses() {
        // Ya se muestra solo por existir botones, esto queda por claridad
    }

    // =========================
    // ACCIONES DEL JUGADOR
    // =========================

    handlePlayerAction(action) {
        if (!this.gameActive) return;

        // Bloqueo mientras se muestra feedback/transición
        if (this.feedbackLock) return;

        // Si NO hay email abierto, no se permite actuar
        if (!this.currentEmail || !this.isEmailViewOpen()) {
            this.showToast("Primero abre un correo de la bandeja para poder responder.");
            return;
        }

        const email = this.currentEmail;

        // Tomar acción desde catálogo (misma fuente de verdad)
        const kind = this.detectEmailKind(email);
        const catalog = this.responseCatalog[kind] || this.responseCatalog.generic;

        const allOptions = [...catalog.safe, ...(catalog.temptations || [])];
        const picked = allOptions.find(o => o.action === action);

        // Fallback
        const resolved = picked || { text: "Acción", action, points: +40, suspicion: +6, risk: "medium" };

        // Aplicar puntuación y sospecha
        this.score += resolved.points;
        this.thiefSuspicion += resolved.suspicion;

        // Errores reales
        const isBad = resolved.points < 0 || resolved.risk === 'high';
        if (isBad) this.mistakesCount++;

        // Clamp
        this.score = Math.max(0, Math.min(2500, this.score));
        this.thiefSuspicion = Math.max(0, Math.min(100, this.thiefSuspicion));

        this.updateScoreDisplay();
        this.updateSuspicionDisplay();

        // Mostrar feedback + suspiciousElements
        this.feedbackLock = true;
        this.setActionsEnabled(false);

        const outcome = this.buildOutcomeMessage(kind, resolved, isBad);
        this.showPostActionFeedback(email, outcome);

        // Contabilizar email analizado
        this.emailsAnalyzed++;

        // Determinar "qué pasaría" DESPUÉS de que el usuario haga clic
        let pendingEndReason = null;

        if (this.score <= 100 || this.mistakesCount >= 3) {
            pendingEndReason = 'defeat';
        } else if (this.thiefSuspicion >= 100) {
            pendingEndReason = 'victory';
        } else if (this.emailsAnalyzed >= 8) {
            pendingEndReason = 'completed';
        }

        // Esperar clic del usuario sobre el feedback (no por tiempo)
        this.waitForFeedbackClick(() => {
            if (pendingEndReason) {
                this.endGame(pendingEndReason);
                return;
            }

            // Regresar a bandeja cuando el usuario decida
            this.returnToInbox();
            this.feedbackLock = false;

            // Generar siguiente email tras volver
            setTimeout(() => this.generateEmail(), 700);
        });
    }

    // Métodos de la barra de herramientas (solo funcionan si hay email abierto)
    markAsSpam() { this.handlePlayerAction('markSpam'); }
    reportPhishing() { this.handlePlayerAction('reportPhishing'); }
    verifySender() { this.handlePlayerAction('verifySender'); }

    // =========================
    // UI HELPERS
    // =========================

    isEmailViewOpen() {
        const emailView = document.getElementById('emailView');
        return emailView && emailView.style.display !== 'none';
    }

    setActionsEnabled(enabled) {
        // Toolbar buttons
        const toolbarButtons = document.querySelectorAll('.email-toolbar .toolbar-btn');
        toolbarButtons.forEach(btn => {
            btn.disabled = !enabled;
            btn.style.opacity = enabled ? '1' : '0.5';
            btn.style.cursor = enabled ? 'pointer' : 'not-allowed';
        });

        // Quick responses (los botones)
        const respButtons = document.querySelectorAll('#quickResponses .response-btn');
        respButtons.forEach(btn => {
            btn.disabled = !enabled;
            btn.style.opacity = enabled ? '1' : '0.5';
            btn.style.cursor = enabled ? 'pointer' : 'not-allowed';
        });
    }

    returnToInbox() {
        const emailList = document.getElementById('emailList');
        const emailView = document.getElementById('emailView');

        if (emailList) emailList.style.display = 'block';
        if (emailView) emailView.style.display = 'none';

        this.currentEmail = null;
        this.hideQuickResponses();
        this.setActionsEnabled(false);
    }

    showPostActionFeedback(email, outcome) {
        const slot = document.getElementById('postActionFeedbackSlot');
        if (!slot) return;

        const elements = email.suspiciousElements || [];
        const suspiciousHtml = elements.length ? `
            <div class="suspicious-element" style="margin-top:12px;">
                <strong>⚠️ Elementos Sospechosos Detectados:</strong>
                <ul style="margin-top:8px;">
                    ${elements.map(el => `<li>${el}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        slot.innerHTML = `
            <div class="post-action-feedback ${outcome.kind}">
                <div class="title">${outcome.title}</div>
                <div class="text">${outcome.text}</div>
                <div class="tip"><strong>Tip:</strong> ${outcome.tip}</div>
            </div>
            ${suspiciousHtml}
        `;

        // Scroll hacia el feedback para que se vea (evita “me regresó y no entendí”)
        setTimeout(() => {
            slot.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }

    waitForFeedbackClick(onContinue) {
        const slot = document.getElementById('postActionFeedbackSlot');
        if (!slot) return;

        // Elemento clickeable: el bloque de feedback
        const feedbackEl = slot.querySelector('.post-action-feedback');
        if (!feedbackEl) return;

        // Hint visual
        feedbackEl.classList.add('click-to-continue');
        feedbackEl.setAttribute('title', 'Clic para continuar');

        // Evitar doble binding
        const handler = (e) => {
            e.stopPropagation();
            feedbackEl.removeEventListener('click', handler);
            // Quitar hint
            feedbackEl.classList.remove('click-to-continue');
            feedbackEl.removeAttribute('title');
            onContinue();
        };

        feedbackEl.addEventListener('click', handler);
    }

    buildOutcomeMessage(kind, resolved, isBad) {
        // “Neutral” la tratamos como safe suave vs safe fuerte (por puntos)
        const isGood = !isBad && resolved.points >= 100;
        const isNeutral = !isBad && resolved.points < 100;

        if (isGood) {
            return {
                kind: 'good',
                title: "✅ Correcto",
                text: "Buena decisión. Evitaste interactuar con el contenido riesgoso.",
                tip: this.tipForKind(kind)
            };
        }

        if (isNeutral) {
            return {
                kind: 'neutral',
                title: "💡 Casi",
                text: "No estuvo mal, pero podrías ser más estricto cuando hay señales de phishing.",
                tip: this.tipForKind(kind)
            };
        }

        return {
            kind: 'bad',
            title: "❌ Caíste en la trampa",
            text: "Interaccionar con enlaces/adjuntos o responder datos puede comprometer tu seguridad.",
            tip: this.tipForKind(kind)
        };
    }

    tipForKind(kind) {
        switch (kind) {
            case 'link':
                return "Antes de abrir un enlace, revisa el dominio real y desconfía de URLs raras o con palabras extra.";
            case 'attachment':
                return "No abras adjuntos inesperados. Si es importante, valida por un canal oficial y escanea el archivo.";
            case 'data':
                return "Ningún servicio serio te pide contraseñas, NIP, CVV o CLABE por email. Verifica siempre por canal oficial.";
            default:
                return "Si algo presiona con urgencia o amenaza, sospecha. Verifica el remitente y reporta si es necesario.";
        }
    }

    showToast(message) {
        // Toast simple para guiar al usuario
        let toast = document.getElementById('emailGameToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'emailGameToast';
            toast.className = 'email-game-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1800);
    }

    injectFeedbackStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .post-action-feedback {
                margin-top: 16px;
                padding: 12px 14px;
                border-radius: 10px;
                border-left: 4px solid;
                animation: fadeSlideIn 0.25s ease;
            }
            .post-action-feedback .title{
                font-weight: 700;
                margin-bottom: 6px;
            }
            .post-action-feedback .text{
                margin-bottom: 6px;
                line-height: 1.4;
            }
            .post-action-feedback .tip{
                opacity: 0.9;
                font-size: 0.95rem;
            }
            .post-action-feedback.good{ background:#d1fae5; color:#065f46; border-left-color:#10b981; }
            .post-action-feedback.neutral{ background:#fef3c7; color:#92400e; border-left-color:#f59e0b; }
            .post-action-feedback.bad{ background:#fee2e2; color:#991b1b; border-left-color:#ef4444; }

            .email-game-toast{
                position: fixed;
                bottom: 18px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.85);
                color: white;
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 0.9rem;
                opacity: 0;
                pointer-events: none;
                transition: opacity .2s ease, transform .2s ease;
                z-index: 9999;
            }
            .email-game-toast.show{
                opacity: 1;
                transform: translateX(-50%) translateY(-4px);
            }
            .post-action-feedback.click-to-continue{
                cursor: pointer;
                position: relative;
            }
            .post-action-feedback.click-to-continue::after{
                content: "Clic para continuar";
                display: block;
                margin-top: 10px;
                font-weight: 700;
                opacity: 0.85;
            }

            @keyframes fadeSlideIn{
                from{ opacity:0; transform: translateY(6px); }
                to{ opacity:1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // =========================
    // HUD
    // =========================

    updateScoreDisplay() {
        document.getElementById('scoreDisplay').textContent = `Puntuación: ${this.score}`;
    }

    updateSuspicionDisplay() {
        document.getElementById('suspicionDisplay').textContent = `Sospecha: ${this.thiefSuspicion}%`;
    }

    // =========================
    // END GAME
    // =========================

    endGame(reason) {
        this.gameActive = false;
        clearInterval(this.timerInterval);

        const endModal = document.getElementById('endGameModal');
        const defeatMessage = document.getElementById('defeatMessage');
        const finalScore = document.getElementById('finalScore');
        const performance = document.getElementById('performanceBreakdown');
        const endTitle = document.getElementById('endTitle');

        if (reason === 'victory') {
            endTitle.textContent = "¡Has Derrotado al Phisher!";
            defeatMessage.textContent =
                "¡Increíble! Identificaste correctamente los intentos de phishing y el estafador se rindió.";
        } 
        else if (reason === 'defeat') {
            endTitle.textContent = "❌ Caíste en el Phishing";
            defeatMessage.textContent =
                "Caíste en un correo malicioso. Los correos fraudulentos suelen presionar, urgir y pedir datos o clics.";
        } 
        else if (reason === 'completed') {
            endTitle.textContent = "✔️ Análisis Completado";
            defeatMessage.textContent =
                "Analizaste todos los correos disponibles. Aún puedes mejorar tu detección de fraudes.";
        } 
        else { // timeout
            endTitle.textContent = "⏱️ Tiempo Agotado";
            defeatMessage.textContent =
                "El tiempo se agotó. En situaciones reales, actuar con calma es clave para evitar fraudes.";
        }

        finalScore.textContent = `Puntuación Final: ${this.score}`;

        performance.innerHTML = `
            <div>Emails analizados: ${this.emailsAnalyzed}</div>
            <div>Errores cometidos: ${this.mistakesCount}</div>
            <div>Sospecha final del ladrón: ${this.thiefSuspicion}%</div>
            <div>Tiempo restante: ${Math.floor(this.timeLeft / 60)}:${(this.timeLeft % 60).toString().padStart(2, '0')}</div>
            <div>Nivel de seguridad: ${this.getSecurityLevel()}</div>
        `;

        endModal.style.display = 'flex';
    }

    getSecurityLevel() {
        if (this.score >= 1500) return "🔒 Experto en Seguridad";
        if (this.score >= 1200) return "🛡️ Muy Seguro";
        if (this.score >= 800) return "✅ Seguro";
        return "⚠️ Necesita Mejorar";
    }
}

// Función global para jugar otra vez
function playAgain() {
    window.location.reload();
}

// Inicializar el juego cuando se carga la página
let emailGame;

document.addEventListener('DOMContentLoaded', () => {
    emailGame = new EmailGame();
});