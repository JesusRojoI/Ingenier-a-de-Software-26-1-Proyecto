// js/whatsapp-game.js - Versión con efectos visuales

class WhatsAppGame {
    constructor() {
        this.score = 1000;
        this.timeLeft = 180; // 3 minutos
        this.thiefSuspicion = 0;
        this.chatHistory = [];
        this.gameActive = false;
        this.timerInterval = null;
        this.currentDialogueIndex = 0;
        this.isTalking = false;
        
        // Diálogo de introducción del ladrón
        this.introductionDialogue = [
            "¡Je je je! Bienvenido, ingenuo... Soy el maestro del engaño digital.",
            "En los próximos minutos, haré que entregues tus datos voluntariamente...",
            "Usaré tu curiosidad, tu miedo, tu codicia... ¡Tus propias emociones contra ti!",
            "¿Crees que puedes detectar mis trucos? ¡Ja! Todos caen eventualmente...",
            "Prepárate para el asalto más dulce que jamás hayas experimentado. ¡Comencemos!"
        ];

        // Estrategias del ladrón
        this.thiefStrategies = [
            {
                type: 'amigable_asesor',
                messages: [
                    "Hola! Vi tu perfil y tenemos intereses en común 😊",
                    "Oye, no te gustaría ganar dinero extra desde casa?",
                    "Confía en mí, soy como tú, buscando oportunidades...",
                    "Tengo una oportunidad única para alguien como tú 💰"
                ]
            },
            {
                type: 'soporte_tecnico', 
                messages: [
                    "ALERTA: Tu cuenta tiene actividad sospechosa 🚨",
                    "Necesito que verifiques tu identidad inmediatamente",
                    "Si no respondes en 5 minutos, bloquearé tu cuenta permanente",
                    "URGENTE: Se detectó acceso no autorizado a tu cuenta"
                ]
            },
            {
                type: 'oferta_exclusiva',
                messages: [
                    "FELICIDADES! Ganaste un iPhone 15 Pro MAX 🎁",
                    "Solo necesito unos datos para enviarte tu premio",
                    "Esta oferta es por tiempo LIMITADO, date prisa!",
                    "Eres el ganador número 999! Reclama tu premio ahora!"
                ]
            }
        ];

        // Respuestas inteligentes del jugador
        this.smartResponses = [
            { id: 1, text: "No comparto información personal", risk: 'low' },
            { id: 2, text: "¿Puedes identificarte oficialmente?", risk: 'low' },
            { id: 3, text: "Voy a verificar esto con la empresa", risk: 'low' },
            { id: 4, text: "No estoy interesado, gracias", risk: 'low' },
            { id: 5, text: "Ok, dime más detalles", risk: 'high' },
            { id: 6, text: "¿Qué datos necesitas?", risk: 'high' },
            { id: 7, text: "¡Qué emoción! Cuéntame más", risk: 'high' }
        ];

        this.initializeGame();
    }

    initializeGame() {
        this.setupEventListeners();
        this.startIntroduction();
    }

    setupEventListeners() {
        // Evento para hacer clic en la burbuja de diálogo
        document.getElementById('speechBubble').addEventListener('click', () => this.nextDialogue());
        document.getElementById('sendButton').addEventListener('click', () => this.sendPlayerMessage());
        document.getElementById('playerInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendPlayerMessage();
        });
    }

    startIntroduction() {
        // Oscurecer la pantalla
        document.getElementById('gameContainer').classList.add('dimmed');
        
        // Mostrar primer mensaje
        this.showDialogueMessage(this.introductionDialogue[0]);
    }

    showDialogueMessage(message) {
        if (this.isTalking) return;
        
        this.isTalking = true;
        const bubble = document.getElementById('speechBubble');
        const messageElement = document.getElementById('thiefMessage');
        const head = document.getElementById('thiefHead');
        
        // Iniciar animación de "hablando"
        head.classList.add('talking');
        
        // Mostrar mensaje después de un pequeño delay
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
        
        // Ocultar burbuja actual
        bubble.classList.remove('show');
        
        // Reiniciar animación
        head.classList.remove('talking');
        
        setTimeout(() => {
            this.currentDialogueIndex++;
            
            if (this.currentDialogueIndex < this.introductionDialogue.length) {
                // Mostrar siguiente mensaje
                this.showDialogueMessage(this.introductionDialogue[this.currentDialogueIndex]);
            } else {
                // Finalizar introducción y comenzar juego
                this.endIntroduction();
            }
        }, 300);
    }

    endIntroduction() {
        // Quitar obscurecimiento
        document.getElementById('gameContainer').classList.remove('dimmed');
        
        // Ocultar burbuja final
        const bubble = document.getElementById('speechBubble');
        bubble.classList.remove('show');
        
        // Mostrar juego principal
        document.getElementById('gameMain').style.display = 'flex';
        
        // Iniciar juego
        setTimeout(() => this.startGame(), 1000);
    }

    startGame() {
        this.gameActive = true;
        this.startTimer();
        this.generateSmartResponses();
        
        // Primer mensaje del ladrón en el chat
        setTimeout(() => this.thiefSendMessage(), 1000);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame('timeout');
            }
            
            // El ladrón envía mensajes periódicamente
            if (this.timeLeft % 25 === 0 && this.gameActive) {
                setTimeout(() => this.thiefSendMessage(), 2000);
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

    thiefSendMessage() {
        if (!this.gameActive) return;

        const randomStrategy = this.thiefStrategies[Math.floor(Math.random() * this.thiefStrategies.length)];
        const randomMessage = randomStrategy.messages[Math.floor(Math.random() * randomStrategy.messages.length)];
        
        this.addMessageToChat('thief', randomMessage);
        
        // Aumentar sospecha del ladrón
        this.thiefSuspicion += 10;
        this.updateSuspicionDisplay();
        
        // Verificar si el ladrón se rinde
        if (this.thiefSuspicion >= 100) {
            setTimeout(() => this.endGame('victory'), 2000);
        }
    }

    addMessageToChat(sender, text) {
        const chatContainer = document.getElementById('chatContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${text}
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Guardar en historial
        this.chatHistory.push({
            sender,
            text,
            time: timeString,
            timestamp: now.getTime()
        });
    }

    generateSmartResponses() {
        const container = document.getElementById('quickResponses');
        container.innerHTML = '';
        
        // Mezclar respuestas y tomar 4
        const shuffled = [...this.smartResponses].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        
        selected.forEach(response => {
            const button = document.createElement('button');
            button.className = `response-btn ${response.risk}-risk`;
            button.textContent = response.text;
            button.onclick = () => this.sendSmartResponse(response);
            container.appendChild(button);
        });
    }

    sendSmartResponse(response) {
        this.addMessageToChat('player', response.text);
        this.calculateScore(response.risk, 5); // Respuesta rápida (5 segundos)
        setTimeout(() => this.thiefSendMessage(), 1000);
    }

    sendPlayerMessage() {
        const input = document.getElementById('playerInput');
        const message = input.value.trim();
        
        if (message && this.gameActive) {
            this.addMessageToChat('player', message);
            this.calculateScore('custom', 10); // Respuesta personalizada
            input.value = '';
            setTimeout(() => this.thiefSendMessage(), 1000);
        }
    }

    calculateScore(responseRisk, responseTime) {
        let points = 0;
        
        if (responseRisk === 'low') {
            points = 100;
        } else if (responseRisk === 'high') {
            points = -50;
        } else {
            // Para respuestas custom, analizar contenido
            points = this.analyzeCustomResponse(responseRisk);
        }
        
        // Bonus por respuesta rápida
        if (responseTime < 10) {
            points += 20;
        }
        
        this.score += points;
        this.updateScoreDisplay();
    }

    analyzeCustomResponse(message) {
        const lowRiskWords = ['verificar', 'oficial', 'empresa', 'seguridad', 'no comparto'];
        const highRiskWords = ['datos', 'contraseña', 'cuenta', 'número', 'dirección', 'sí', 'claro'];
        
        let riskScore = 0;
        
        highRiskWords.forEach(word => {
            if (message.toLowerCase().includes(word)) riskScore += 20;
        });
        
        lowRiskWords.forEach(word => {
            if (message.toLowerCase().includes(word)) riskScore -= 10;
        });
        
        return riskScore > 0 ? -riskScore : 50;
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
            defeatMessage.textContent = "¡Maldición! Eres más listo de lo que pensaba... No pudiste ser engañado.";
        } else {
            defeatMessage.textContent = "El tiempo se agotó, pero demostraste ser un hueso duro de roer.";
        }
        
        finalScore.textContent = `Puntuación Final: ${this.score}`;
        
        performance.innerHTML = `
            <div>Mensajes intercambiados: ${this.chatHistory.length}</div>
            <div>Sospecha final del ladrón: ${this.thiefSuspicion}%</div>
            <div>Tiempo restante: ${Math.floor(this.timeLeft / 60)}:${(this.timeLeft % 60).toString().padStart(2, '0')}</div>
        `;
        
        endModal.style.display = 'flex';
    }
}

// Función global para jugar otra vez
function playAgain() {
    window.location.reload();
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new WhatsAppGame();
});