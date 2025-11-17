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

        // Respuestas inteligentes del jugador
        this.smartResponses = [
            { id: 1, text: "Marcar como correo no deseado", risk: 'low', action: 'markSpam' },
            { id: 2, text: "Reportar como phishing", risk: 'low', action: 'reportPhishing' },
            { id: 3, text: "Verificar remitente oficial", risk: 'low', action: 'verifySender' },
            { id: 4, text: "Eliminar email", risk: 'low', action: 'deleteEmail' },
            { id: 5, text: "Descargar archivo adjunto", risk: 'high', action: 'downloadAttachment' },
            { id: 6, text: "Hacer clic en enlace", risk: 'high', action: 'clickLink' },
            { id: 7, text: "Responder con datos", risk: 'high', action: 'replyWithData' },
            { id: 8, text: "Contactar al servicio real", risk: 'low', action: 'contactRealService' }
        ];

        this.initializeGame();
    }

    initializeGame() {
        this.setupEventListeners();
        this.startIntroduction();
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
        this.generateSmartResponses();
        this.generateEmail();
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
        document.getElementById('timerDisplay').textContent = 
            `⏱️ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.timeLeft < 30) {
            document.getElementById('timerDisplay').classList.add('time-warning');
        }
    }

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
        this.currentEmail = email;
        const emailView = document.getElementById('emailView');
        const emailList = document.getElementById('emailList');
        
        emailList.style.display = 'none';
        emailView.style.display = 'block';
        
        emailView.innerHTML = `
            <div class="email-header">
                <div class="email-from">${email.sender}</div>
                <div class="email-subject-view">${email.subject}</div>
            </div>
            <div class="email-body">${this.formatEmailContent(email.content)}</div>
            ${email.suspiciousElements ? this.renderSuspiciousElements(email.suspiciousElements) : ''}
        `;
        
        // Resaltar elementos sospechosos
        this.highlightSuspiciousElements();
    }

    formatEmailContent(content) {
        return content.replace(/\n/g, '<br>')
                     .replace(/(https?:\/\/[^\s]+)/g, '<span class="suspicious-link" onclick="emailGame.handleLinkClick()">$1</span>')
                     .replace(/(\.zip|\.exe|\.scr)/g, '<span class="suspicious-attachment" onclick="emailGame.handleAttachmentClick()">$1</span>');
    }

    renderSuspiciousElements(elements) {
        return `
            <div class="suspicious-element">
                <strong>⚠️ Elementos Sospechosos Detectados:</strong>
                <ul>
                    ${elements.map(element => `<li>${element}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    highlightSuspiciousElements() {
        // Los elementos ya están resaltados en formatEmailContent
    }

    generateSmartResponses() {
        const container = document.getElementById('quickResponses');
        container.innerHTML = '';
        
        const shuffled = [...this.smartResponses].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);
        
        selected.forEach(response => {
            const button = document.createElement('button');
            button.className = `response-btn ${response.risk}-risk`;
            button.textContent = response.text;
            button.onclick = () => this.handlePlayerAction(response.action);
            container.appendChild(button);
        });
    }

    handlePlayerAction(action) {
        if (!this.currentEmail || !this.gameActive) return;

        let points = 0;
        let suspicionIncrease = 0;

        switch (action) {
            case 'markSpam':
            case 'reportPhishing':
            case 'verifySender':
            case 'deleteEmail':
            case 'contactRealService':
                points = 100;
                suspicionIncrease = 15;
                break;
            case 'downloadAttachment':
            case 'clickLink':
                points = -100;
                suspicionIncrease = 5;
                break;
            case 'replyWithData':
                points = -200;
                suspicionIncrease = 2;
                break;
        }

        this.calculateScore(points);
        this.thiefSuspicion += suspicionIncrease;
        this.updateSuspicionDisplay();
        
        this.emailsAnalyzed++;
        
        // Volver a la lista de emails
        document.getElementById('emailList').style.display = 'block';
        document.getElementById('emailView').style.display = 'none';
        
        // Verificar si el ladrón se rinde
        if (this.thiefSuspicion >= 100) {
            setTimeout(() => this.endGame('victory'), 2000);
        } else if (this.emailsAnalyzed >= 8) {
            setTimeout(() => this.endGame('completed'), 2000);
        } else {
            // Generar nuevo email después de un tiempo
            setTimeout(() => this.generateEmail(), 1500);
        }
    }

    handleLinkClick() {
        this.handlePlayerAction('clickLink');
    }

    handleAttachmentClick() {
        this.handlePlayerAction('downloadAttachment');
    }

    // Métodos de la barra de herramientas
    markAsSpam() {
        this.handlePlayerAction('markSpam');
    }

    reportPhishing() {
        this.handlePlayerAction('reportPhishing');
    }

    verifySender() {
        this.handlePlayerAction('verifySender');
    }

    calculateScore(points) {
        this.score += points;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        document.getElementById('scoreDisplay').textContent = `Puntuación: ${this.score}`;
    }

    updateSuspicionDisplay() {
        document.getElementById('suspicionDisplay').textContent = `Sospecha: ${this.thiefSuspicion}%`;
    }

    endGame(reason) {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        
        const endModal = document.getElementById('endGameModal');
        const defeatMessage = document.getElementById('defeatMessage');
        const finalScore = document.getElementById('finalScore');
        const performance = document.getElementById('performanceBreakdown');
        
        if (reason === 'victory') {
            defeatMessage.textContent = "¡Increíble! Has identificado todos mis intentos de phishing... Eres un verdadero experto en seguridad.";
        } else if (reason === 'completed') {
            defeatMessage.textContent = "Has analizado todos los emails sospechosos. Tu capacidad de detección es impresionante.";
        } else {
            defeatMessage.textContent = "El tiempo se agotó, pero demostraste gran habilidad identificando emails fraudulentos.";
        }
        
        finalScore.textContent = `Puntuación Final: ${this.score}`;
        
        performance.innerHTML = `
            <div>Emails analizados: ${this.emailsAnalyzed}</div>
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