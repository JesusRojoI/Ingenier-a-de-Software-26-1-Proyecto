class WhatsAppGame {
    constructor() {
        // Inicializar el chatbot
        this.chatbot = new PhishingChatbot('whatsapp');
        
        // Variables del juego
        this.gameActive = false;
        this.timerInterval = null;
        this.timeLeft = 180; // 3 minutos
        this.currentDialogueIndex = 0;
        this.isTalking = false;
        
        // Diálogo de introducción del ladrón
        this.introductionDialogue = [
            "¡Je je je! Bienvenido, ingenuo... Soy el maestro del engaño digital.",
            "En los próximos minutos, intentaré que entregues tus datos voluntariamente...",
            "Usaré tu curiosidad, tu miedo, tu codicia... ¡Tus propias emociones contra ti!",
            "¿Crees que puedes detectar mis trucos? ¡Ja! Todos caen eventualmente...",
            "Prepárate para el desafío más realista que jamás hayas experimentado. ¡Comencemos!"
        ];

        this.initializeGame();
    }

    initializeGame() {
        this.setupEventListeners();
        this.startIntroduction();
    }

    setupEventListeners() {
        const speechBubble = document.getElementById('speechBubble');
        if (speechBubble) {
            speechBubble.addEventListener('click', () => this.nextDialogue());
        }
        
        // Evento para enviar mensaje con botón
        const sendButton = document.getElementById('sendButton');
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendPlayerMessage());
        }
        
        // Evento para enviar mensaje con Enter
        const playerInput = document.getElementById('playerInput');
        if (playerInput) {
            playerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendPlayerMessage();
            });
        }
    }

    // ========== INTRODUCCIÓN ==========

    startIntroduction() {
        // Oscurecer la pantalla
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.classList.add('dimmed');
        }
        
        // Mostrar primer mensaje
        this.showDialogueMessage(this.introductionDialogue[0]);
    }

    showDialogueMessage(message) {
        if (this.isTalking) return;
        
        this.isTalking = true;
        const bubble = document.getElementById('speechBubble');
        const messageElement = document.getElementById('thiefMessage');
        const head = document.getElementById('thiefHead');
        
        if (!bubble || !messageElement || !head) return;
        
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
        
        if (!bubble || !head) return;
        
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
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.classList.remove('dimmed');
        }
        
        // Ocultar burbuja final
        const bubble = document.getElementById('speechBubble');
        if (bubble) {
            bubble.classList.remove('show');
        }
        
        // Mostrar juego principal
        const gameMain = document.getElementById('gameMain');
        if (gameMain) {
            gameMain.style.display = 'flex';
        }
        
        // Iniciar juego
        setTimeout(() => this.startGame(), 1000);
    }

    // ========== INICIO DEL JUEGO ==========

    startGame() {
        this.gameActive = true;
        this.startTimer();
        this.generateSmartResponses();
        
        // Mostrar el primer mensaje del chatbot
        const initialMessage = this.chatbot.getInitialMessage();
        if (initialMessage) {
            setTimeout(() => {
                this.addMessageToChat('thief', initialMessage);
            }, 1000);
        }
        
        // Actualizar HUD inicial
        this.updateHUD();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame('timeout');
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timerDisplay = document.getElementById('timerDisplay');
        
        if (timerDisplay) {
            timerDisplay.textContent = 
                `⏱️ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (this.timeLeft < 30) {
                timerDisplay.classList.add('time-warning');
            }
        }
    }

    // ========== MENSAJES DEL CHAT ==========

    addMessageToChat(sender, text) {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;
        
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
    }

    // ========== RESPUESTAS RÁPIDAS ==========

    generateSmartResponses() {
        const quickResponsesData = [
            { text: "❌ No me interesa", safe: true },
            { text: "❓ ¿Quién eres?", neutral: true },
            { text: "🔍 Voy a verificar esto", safe: true },
            { text: "💬 Cuéntame más", dangerous: true },
            { text: "🚫 No comparto datos", safe: true },
            { text: "✅ ¿Qué necesitas?", dangerous: true }
        ];
        
        const container = document.getElementById('quickResponses');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Mezclar y tomar 4 respuestas
        const shuffled = quickResponsesData.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        
        selected.forEach(response => {
            const button = document.createElement('button');
            button.className = 'response-btn';
            
            if (response.safe) {
                button.classList.add('low-risk');
            } else if (response.dangerous) {
                button.classList.add('high-risk');
            } else {
                button.classList.add('medium-risk');
            }
            
            button.textContent = response.text;
            button.onclick = () => this.sendQuickResponse(response.text);
            container.appendChild(button);
        });
    }

    sendQuickResponse(text) {
        // Quitar emojis del texto antes de enviar
        const cleanText = text.replace(/[❌❓🔍💬🚫✅]/g, '').trim();
        this.processPlayerResponse(cleanText);
    }

    // ========== ENVIAR MENSAJE DEL JUGADOR ==========

    sendPlayerMessage() {
        const input = document.getElementById('playerInput');
        if (!input) return;
        
        const message = input.value.trim();
        
        if (message && this.gameActive) {
            this.processPlayerResponse(message);
            input.value = '';
        }
    }

    // ========== PROCESAR RESPUESTA CON CHATBOT ==========

    processPlayerResponse(message) {
        // Agregar mensaje del jugador al chat
        this.addMessageToChat('player', message);
        
        // Procesar con el chatbot
        const result = this.chatbot.processPlayerResponse(message);
        
        // Mostrar feedback visual
        this.showFeedback(result.feedback);
        
        // Actualizar HUD
        this.updateHUD();
        
        // Respuesta del bot después de un delay
        setTimeout(() => {
            this.addMessageToChat('thief', result.botMessage);
            
            // Verificar estado del juego
            if (result.gameStatus.status !== 'ongoing') {
                setTimeout(() => this.endGame(result.gameStatus), 1500);
            }
        }, 800);
    }

    // ========== FEEDBACK VISUAL ==========

    showFeedback(feedback) {
        // Crear elemento de feedback flotante
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback-message ${feedback.color}`;
        feedbackDiv.style.cssText = `
            background: ${feedback.color === 'safe' ? '#d1fae5' : feedback.color === 'dangerous' ? '#fee2e2' : '#fef3c7'};
            color: ${feedback.color === 'safe' ? '#065f46' : feedback.color === 'dangerous' ? '#991b1b' : '#92400e'};
            padding: 10px 15px;
            margin: 10px 0;
            border-radius: 8px;
            font-size: 0.85rem;
            border-left: 4px solid ${feedback.color === 'safe' ? '#10b981' : feedback.color === 'dangerous' ? '#ef4444' : '#f59e0b'};
            animation: slideIn 0.3s ease;
        `;
        feedbackDiv.innerHTML = `
            <strong>${feedback.message}</strong><br>
            <small>${feedback.tip}</small>
        `;
        
        chatContainer.appendChild(feedbackDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Eliminar después de 4 segundos
        setTimeout(() => {
            feedbackDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => feedbackDiv.remove(), 300);
        }, 4000);
    }

    // ========== ACTUALIZAR HUD ==========

    updateHUD() {
        const gameState = this.chatbot.getGameState();
        
        // Actualizar puntuación
        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay) {
            scoreDisplay.textContent = `Puntuación: ${gameState.score}`;
        }
        
        // Actualizar sospecha
        const suspicionDisplay = document.getElementById('suspicionDisplay');
        if (suspicionDisplay) {
            suspicionDisplay.textContent = `Sospecha: ${gameState.suspicion}%`;
        }
    }

    // ========== FINALIZAR JUEGO ==========

    endGame(gameStatus) {
        this.gameActive = false;
        clearInterval(this.timerInterval);
        
        const gameState = this.chatbot.getGameState();
        
        const endModal = document.getElementById('endGameModal');
        const defeatMessage = document.getElementById('defeatMessage');
        const finalScore = document.getElementById('finalScore');
        const performance = document.getElementById('performanceBreakdown');
        
        if (!endModal || !defeatMessage || !finalScore || !performance) return;
        
        // Configurar mensaje según el resultado
        if (gameStatus.status === 'victory') {
            defeatMessage.textContent = "¡Increíble! No pudiste ser engañado... Eres un experto en seguridad digital.";
        } else if (gameStatus.status === 'defeat') {
            defeatMessage.textContent = "Caíste en mi trampa... Pero has aprendido mucho en el proceso.";
        } else if (gameStatus.status === 'timeout') {
            defeatMessage.textContent = "El tiempo se agotó, pero demostraste ser cauteloso.";
        } else {
            defeatMessage.textContent = "Completaste todas las interacciones. ¡Bien hecho!";
        }
        
        finalScore.textContent = `Puntuación Final: ${gameState.score}`;
        
        // Generar estadísticas
        const securityLevel = this.getSecurityLevel(gameState.score);
        performance.innerHTML = `
            <div><strong>📊 Estadísticas del Juego:</strong></div>
            <div>• Mensajes intercambiados: ${gameState.conversationLength}</div>
            <div>• Intentos realizados: ${gameState.attempts}/${gameState.maxAttempts}</div>
            <div>• Sospecha final del estafador: ${gameState.suspicion}%</div>
            <div>• Tiempo restante: ${Math.floor(this.timeLeft / 60)}:${(this.timeLeft % 60).toString().padStart(2, '0')}</div>
            <div>• Nivel de seguridad: ${securityLevel}</div>
        `;
        
        endModal.style.display = 'flex';
    }

    getSecurityLevel(score) {
        if (score >= 1500) return "🔒 Experto en Seguridad";
        if (score >= 1200) return "🛡️ Muy Seguro";
        if (score >= 800) return "✅ Seguro";
        if (score >= 500) return "⚠️ Necesita Mejorar";
        return "🚨 Alto Riesgo";
    }
}

// ========== FUNCIÓN GLOBAL PARA REINICIAR ==========

function playAgain() {
    window.location.reload();
}

// ========== INICIALIZAR EL JUEGO ==========

let whatsappGame;

document.addEventListener('DOMContentLoaded', () => {
    // Verificar que el chatbot esté disponible
    if (typeof PhishingChatbot === 'undefined') {
        console.error('ERROR: El archivo chatbot-engine.js debe cargarse antes que whatsapp-game.js');
        alert('Error al cargar el juego. Por favor, recarga la página.');
        return;
    }
    
    whatsappGame = new WhatsAppGame();
    console.log('WhatsApp Game iniciado con el motor de chatbot');
});

// Agregar estilos dinámicos para las animaciones de feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);