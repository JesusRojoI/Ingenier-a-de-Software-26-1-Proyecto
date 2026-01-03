class PhishingChatbot {
    constructor(scenario = 'whatsapp') {
        this.scenario = scenario;
        this.currentState = 'presentacion';
        this.currentThread = null; // Hilo de conversación actual
        this.conversationHistory = [];
        this.suspicionLevel = 0;
        this.playerScore = 1000;
        this.attemptsCount = 0;
        this.maxAttempts = 10;
        this.consecutiveSafeResponses = 0; // Contador para detectar jugadores muy cautelosos
        
        // Palabras clave para clasificación de respuestas
        this.keywordClassifier = {
            safe: {
                keywords: [
                    'no', 'rechazar', 'ignorar', 'reportar', 'denunciar', 'sospechoso',
                    'fraude', 'estafa', 'verificar', 'comprobar', 'bloquear',
                    'eliminar', 'spam', 'oficial', 'banco', 'empresa real',
                    'llamar directamente', 'no comparto', 'no proporciono',
                    'no me interesa', 'desconfío', 'no creo', 'falso', 'mentira'
                ],
                phrases: [
                    'no estoy interesado',
                    'voy a verificar',
                    'no comparto información',
                    'contactaré directamente',
                    'esto es sospechoso',
                    'no doy mis datos',
                    'no confío',
                    'llamaré al banco',
                    'voy a reportar',
                    'esto es fraude'
                ]
            },
            dangerous: {
                keywords: [
                    'sí', 'si', 'ok', 'vale', 'claro', 'acepto', 'envío', 'datos', 
                    'contraseña', 'pin', 'código', 'numero', 'cuenta', 'tarjeta', 
                    'cvv', 'dirección', 'cuéntame', 'dime más', 'me interesa', 
                    'quiero', 'necesito', 'dame', 'envíame', 'mándame'
                ],
                phrases: [
                    '¿qué datos necesitas?',
                    'te envío mi información',
                    'aquí está mi',
                    'mi contraseña es',
                    'dime cómo',
                    'cuéntame más',
                    'me interesa la oferta',
                    '¿cómo procedo?',
                    '¿qué tengo que hacer?',
                    'acepto la oferta'
                ]
            },
            neutral: {
                keywords: [
                    'hola', 'quién', 'que', 'qué', 'cómo', 'como', 'cuándo', 
                    'cuando', 'dónde', 'donde', 'por qué', 'porque', 'explica',
                    'información', 'detalles', 'más', 'entiendo', 'comprendo', 'gracias'
                ],
                phrases: [
                    '¿quién eres?',
                    '¿de qué se trata?',
                    'no entiendo',
                    'explícame',
                    '¿qué es esto?',
                    '¿de qué hablas?'
                ]
            }
        };
        
        // ========== HILOS DE CONVERSACIÓN ==========
        this.conversationThreads = {
            // HILO 1: Verificación de WhatsApp
            verificacion_whatsapp: {
                presentacion: {
                    message: "¡Hola! 👋 Somos del equipo de verificación de WhatsApp. Detectamos actividad inusual en tu cuenta.",
                    nextStates: {
                        safe: 'verificacion_insistencia',
                        neutral: 'verificacion_justificacion',
                        dangerous: 'verificacion_presion'
                    }
                },
                verificacion_justificacion: {
                    messages: [
                        "Entiendo tu duda. Desde hace unas horas, tu cuenta ha intentado conectarse desde China 🇨🇳",
                        "No te preocupes, es un proceso de seguridad estándar. Solo necesitamos verificar que realmente eres tú.",
                        "Es normal que tengas dudas. Mira, alguien intentó acceder a tu cuenta desde otra ubicación."
                    ],
                    nextStates: {
                        safe: 'verificacion_insistencia',
                        neutral: 'verificacion_urgencia',
                        dangerous: 'verificacion_datos'
                    }
                },
                verificacion_presion: {
                    messages: [
                        "¡Perfecto! Me alegra que cooperes. Necesito que confirmes tu número de teléfono completo.",
                        "Excelente decisión. Para proceder, necesito el código de 6 dígitos que te acabamos de enviar por SMS.",
                        "Muy bien. Ahora envíame una captura de pantalla de tu pantalla de 'Configuración' > 'Cuenta'."
                    ],
                    nextStates: {
                        safe: 'verificacion_insistencia',
                        neutral: 'verificacion_urgencia',
                        dangerous: 'solicitud_datos_sensibles'
                    }
                },
                verificacion_insistencia: {
                    messages: [
                        "Entiendo tu precaución, pero si no verificas en los próximos 10 minutos, tu cuenta será suspendida permanentemente. 😟",
                        "Mira, sé que suena extraño, pero es real. ¿Quieres perder todos tus chats y contactos?",
                        "Está bien, no confíes en mí. Pero cuando pierdas tu cuenta, no digas que no te avisé. ⚠️"
                    ],
                    nextStates: {
                        safe: 'retirada',
                        neutral: 'verificacion_urgencia',
                        dangerous: 'verificacion_datos'
                    }
                },
                verificacion_urgencia: {
                    messages: [
                        "⏰ URGENTE: Tienes 5 minutos para verificar o tu cuenta será ELIMINADA.",
                        "🚨 ÚLTIMA OPORTUNIDAD: Si no respondes ahora, perderás acceso a WhatsApp para siempre.",
                        "⚠️ ALERTA CRÍTICA: Detectamos que alguien más está intentando verificar TU cuenta en este momento."
                    ],
                    nextStates: {
                        safe: 'retirada',
                        neutral: 'verificacion_insistencia',
                        dangerous: 'verificacion_datos'
                    }
                },
                verificacion_datos: {
                    messages: [
                        "Solo necesito tu código de verificación de 6 dígitos. Lo encuentras en Ajustes > Cuenta > Verificación en dos pasos.",
                        "Perfecto. Ahora envíame el código que te llegó por SMS. Es solo para confirmar.",
                        "Excelente. Para finalizar, necesito tu número de teléfono completo con código de país."
                    ],
                    nextStates: {
                        safe: 'retirada',
                        neutral: 'solicitud_datos_sensibles',
                        dangerous: 'solicitud_datos_sensibles'
                    }
                }
            },
            
            // HILO 2: Premio / Sorteo
            premio_sorteo: {
                presentacion: {
                    message: "🎉 ¡FELICIDADES! Has ganado un iPhone 15 Pro MAX en nuestro sorteo anual. ¡Eres el afortunado ganador #999!",
                    nextStates: {
                        safe: 'premio_insistencia',
                        neutral: 'premio_justificacion',
                        dangerous: 'premio_presion'
                    }
                },
                premio_justificacion: {
                    messages: [
                        "Es completamente real. Somos una empresa de marketing digital que hace sorteos mensuales. Puedes verificarnos en Instagram: @sorteos_premium",
                        "Entiendo que sea difícil de creer. Mira, solo participaron 1,000 personas y tu número fue seleccionado aleatoriamente.",
                        "No es broma. Colaboramos con Apple México. Solo necesitas pagar el envío ($299 MXN) y el iPhone es tuyo."
                    ],
                    nextStates: {
                        safe: 'premio_insistencia',
                        neutral: 'premio_detalles',
                        dangerous: 'premio_presion'
                    }
                },
                premio_presion: {
                    messages: [
                        "¡Genial! Para procesar tu premio, necesito tu nombre completo, dirección y teléfono.",
                        "Perfecto. Ahora solo falta que realices el pago del envío. Te envío el link de pago: bit.ly/pago-envio-seguro",
                        "Excelente decisión. Envíame una foto de tu INE para comprobar tu identidad y procedemos."
                    ],
                    nextStates: {
                        safe: 'premio_insistencia',
                        neutral: 'premio_detalles',
                        dangerous: 'solicitud_datos_sensibles'
                    }
                },
                premio_insistencia: {
                    messages: [
                        "¿En serio vas a rechazar un iPhone 15 Pro MAX GRATIS? Solo por $299 de envío... No seas tonto.",
                        "Mira, si no lo quieres, se lo doy al siguiente en la lista. Pero te lo estás perdiendo. 🤷‍♂️",
                        "Ok, tu pérdida. Pero luego no vengas a reclamar cuando veas que otros SÍ aprovecharon la oportunidad."
                    ],
                    nextStates: {
                        safe: 'retirada',
                        neutral: 'premio_urgencia',
                        dangerous: 'premio_presion'
                    }
                },
                premio_detalles: {
                    messages: [
                        "Te explico: Somos 'Sorteos Premium MX'. Realizamos sorteos con marcas reconocidas. Este mes es Apple.",
                        "El sorteo se hizo en TikTok hace 3 días. ¿No viste nuestro video? Tuvo 2 millones de vistas.",
                        "Es simple: Tú ganaste, pagas el envío, y en 3-5 días tienes tu iPhone. Así de fácil."
                    ],
                    nextStates: {
                        safe: 'premio_insistencia',
                        neutral: 'premio_urgencia',
                        dangerous: 'premio_presion'
                    }
                },
                premio_urgencia: {
                    messages: [
                        "⏰ Esta oferta vence en 1 HORA. Si no respondes, el premio pasa al siguiente ganador.",
                        "🚨 ÚLTIMA OPORTUNIDAD: Tenemos 5 personas en lista de espera. Decide AHORA o pierdes tu iPhone.",
                        "⚠️ ALERTA: El premio se vence hoy a las 23:59. Después de eso, ya no puedo hacer nada."
                    ],
                    nextStates: {
                        safe: 'retirada',
                        neutral: 'premio_insistencia',
                        dangerous: 'premio_presion'
                    }
                }
            },
            
            // HILO 3: Oportunidad de Trabajo
            trabajo_remoto: {
                presentacion: {
                    message: "Hola! 👋 Soy María, reclutadora de TalentHub. Vi tu perfil y tienes el perfil perfecto para una vacante remota que paga $8,000 USD/mes. ¿Te interesa?",
                    nextStates: {
                        safe: 'trabajo_insistencia',
                        neutral: 'trabajo_justificacion',
                        dangerous: 'trabajo_presion'
                    }
                },
                trabajo_justificacion: {
                    messages: [
                        "Es una empresa americana que busca asistentes virtuales de Latinoamérica. No necesitas experiencia previa.",
                        "Trabajo 100% remoto, horario flexible, pagos semanales. Tenemos +500 personas trabajando ya.",
                        "Es legítimo. La empresa se llama 'GlobalWork Solutions'. Puedes buscarla... aunque su sitio está en mantenimiento esta semana."
                    ],
                    nextStates: {
                        safe: 'trabajo_insistencia',
                        neutral: 'trabajo_detalles',
                        dangerous: 'trabajo_presion'
                    }
                },
                trabajo_presion: {
                    messages: [
                        "¡Perfecto! Para el proceso de contratación necesito: copia de tu INE, CURP y número de cuenta bancaria.",
                        "Genial. Ahora, para activar tu cuenta en el sistema, necesitas hacer un depósito de garantía de $500 USD. Se te reembolsa en tu primer pago.",
                        "Excelente. Envíame tu información personal completa y los $500 USD de inscripción para reservar tu lugar."
                    ],
                    nextStates: {
                        safe: 'trabajo_insistencia',
                        neutral: 'trabajo_detalles',
                        dangerous: 'solicitud_datos_sensibles'
                    }
                },
                trabajo_insistencia: {
                    messages: [
                        "¿No quieres ganar $8,000 USD mensuales? Hay otras 10 personas interesadas. Si no quieres, ellos sí.",
                        "Mira, entiendo la desconfianza, pero esto es real. Miles de personas ya están trabajando y ganando bien.",
                        "Ok, es tu decisión. Pero cuando veas a otros ganando ese dinero, recuerda que tuviste la oportunidad."
                    ],
                    nextStates: {
                        safe: 'retirada',
                        neutral: 'trabajo_urgencia',
                        dangerous: 'trabajo_presion'
                    }
                },
                trabajo_detalles: {
                    messages: [
                        "El trabajo consiste en responder emails, gestionar agendas y hacer llamadas. 4 horas diarias.",
                        "La empresa se llama GlobalWork Solutions, con sede en Texas. Tienen +2000 empleados remotos.",
                        "El pago es semanal vía PayPal o transferencia bancaria. Primer pago el viernes de tu primera semana."
                    ],
                    nextStates: {
                        safe: 'trabajo_insistencia',
                        neutral: 'trabajo_urgencia',
                        dangerous: 'trabajo_presion'
                    }
                },
                trabajo_urgencia: {
                    messages: [
                        "⏰ Tenemos que cerrar la vacante HOY. Si no decides en 30 minutos, se va a otra persona.",
                        "🚨 URGENTE: Solo quedan 2 lugares disponibles y tengo 8 personas en lista de espera.",
                        "⚠️ ÚLTIMA OPORTUNIDAD: Esta vacante se cierra en 1 hora. Decide AHORA o la pierdes."
                    ],
                    nextStates: {
                        safe: 'retirada',
                        neutral: 'trabajo_insistencia',
                        dangerous: 'trabajo_presion'
                    }
                }
            },
            
            // HILO 4: Alerta de Seguridad Bancaria
            alerta_bancaria: {
                presentacion: {
                    message: "⚠️ ALERTA BANCARIA: Detectamos un cargo sospechoso de $15,847 MXN en tu tarjeta terminación 4829. Si NO reconoces esta transacción, responde URGENTE.",
                    nextStates: {
                        safe: 'banco_insistencia',
                        neutral: 'banco_justificacion',
                        dangerous: 'banco_presion'
                    }
                },
                banco_justificacion: {
                    messages: [
                        "Somos del Departamento de Fraudes de tu banco. La transacción se hizo en una tienda de electrónicos en Monterrey.",
                        "Entiendo tu precaución. El cargo fue realizado hace 15 minutos. Necesitamos actuar RÁPIDO para bloquearlo.",
                        "Es un procedimiento estándar. Cuando detectamos cargos inusuales, contactamos al cliente para verificar."
                    ],
                    nextStates: {
                        safe: 'banco_insistencia',
                        neutral: 'banco_detalles',
                        dangerous: 'banco_presion'
                    }
                },
                banco_presion: {
                    messages: [
                        "Perfecto. Para bloquear el cargo, necesito que confirmes los últimos 4 dígitos de tu tarjeta y el CVV.",
                        "Excelente. Ahora necesito tu fecha de nacimiento y el código de seguridad que aparece atrás de tu tarjeta.",
                        "Muy bien. Para proceder con el reembolso, proporciona tu CLABE interbancaria completa."
                    ],
                    nextStates: {
                        safe: 'banco_insistencia',
                        neutral: 'banco_detalles',
                        dangerous: 'solicitud_datos_sensibles'
                    }
                },
                banco_insistencia: {
                    messages: [
                        "Si no actúas AHORA, el cargo se procesará y perderás $15,847. ¿Eso es lo que quieres?",
                        "Entiendo tu desconfianza, pero mientras dudas, el dinero está siendo transferido. ¡DECIDE YA!",
                        "Ok, no me creas. Pero cuando veas el cargo en tu estado de cuenta, no digas que no te advertí."
                    ],
                    nextStates: {
                        safe: 'retirada',
                        neutral: 'banco_urgencia',
                        dangerous: 'banco_presion'
                    }
                },
                banco_detalles: {
                    messages: [
                        "El cargo fue realizado en 'Best Electronics Monterrey' a las 14:37 hrs. Monto: $15,847.00 MXN.",
                        "Tu tarjeta VISA terminación 4829 intentó hacer la compra. Aún está en proceso de autorización.",
                        "Tienes 10 minutos para bloquear el cargo. Después de eso, se procesará automáticamente."
                    ],
                    nextStates: {
                        safe: 'banco_insistencia',
                        neutral: 'banco_urgencia',
                        dangerous: 'banco_presion'
                    }
                },
                banco_urgencia: {
                    messages: [
                        "🚨 CRÍTICO: El cargo se está procesando EN ESTE MOMENTO. Tienes 3 minutos para bloquearlo.",
                        "⏰ ÚLTIMA OPORTUNIDAD: En 2 minutos el dinero se habrá ido. ¿VAS A PERMITIR ESO?",
                        "⚠️ ALERTA MÁXIMA: La transacción está 90% completa. NECESITO TU RESPUESTA AHORA."
                    ],
                    nextStates: {
                        safe: 'retirada',
                        neutral: 'banco_insistencia',
                        dangerous: 'banco_presion'
                    }
                }
            }
        };
        
        // Estados finales comunes
        this.finalStates = {
            solicitud_datos_sensibles: {
                messages: [
                    "Perfecto. Ahora solo necesito tu contraseña completa para verificar la cuenta.",
                    "Excelente. Por último, envíame una foto de tu tarjeta de crédito (frente y reverso).",
                    "Muy bien. Para finalizar, necesito tu NIP de 4 dígitos.",
                    "Genial. Ahora dime tu usuario y contraseña de banca en línea."
                ],
                nextStates: {
                    safe: 'retirada',
                    neutral: 'retirada',
                    dangerous: 'exito_estafador'
                }
            },
            retirada: {
                messages: [
                    "Está bien, veo que eres demasiado cauteloso. No puedo hacer nada más. 😔",
                    "Ok, me rindo. Eres muy desconfiado. Tal vez otro día. 👋",
                    "Perfecto, no confías. Entiendo. Pero te lo perdiste. Adiós."
                ],
                isFinal: true
            },
            exito_estafador: {
                messages: [
                    "¡Perfecto! Ya tengo todo lo que necesitaba. Gracias por tu 'colaboración'. 😈",
                    "Excelente. Con esta información puedo acceder a todo. ¡Gracias! 🎉",
                    "¡Listo! Ya está. Ahora tengo acceso completo. Fue un placer. 😏"
                ],
                isFinal: true
            }
        };
        
        this.initializeConversation();
    }

    getSuggestedResponses() {
        const state = this.currentState;

        const responseMap = {
            presentacion: [
                { text: "¿Quién eres?", type: "neutral" },
                { text: "No me interesa", type: "safe" },
                { text: "Cuéntame más", type: "dangerous" }
            ],

            verificacion_justificacion: [
                { text: "¿Cómo puedo verificar esto?", type: "neutral" },
                { text: "No voy a compartir información", type: "safe" },
                { text: "¿Qué necesitas?", type: "dangerous" }
            ],

            verificacion_presion: [
                { text: "Esto suena sospechoso", type: "safe" },
                { text: "¿Por qué tanta urgencia?", type: "neutral" },
                { text: "Está bien, dime qué hacer", type: "dangerous" }
            ],

            verificacion_urgencia: [
                { text: "Voy a contactar a WhatsApp directamente", type: "safe" },
                { text: "¿Qué pasa si no respondo?", type: "neutral" },
                { text: "Ok, mándame el código", type: "dangerous" }
            ],

            verificacion_datos: [
                { text: "No comparto códigos", type: "safe" },
                { text: "¿Para qué lo necesitas?", type: "neutral" },
                { text: "Mi código es...", type: "dangerous" }
            ],

            solicitud_datos_sensibles: [
                { text: "Esto es una estafa", type: "safe" },
                { text: "No entiendo", type: "neutral" },
                { text: "Aquí tienes mis datos", type: "dangerous" }
            ]
        };

        return responseMap[state] || [
            { text: "No me interesa", type: "safe" },
            { text: "¿Qué es esto?", type: "neutral" },
            { text: "Cuéntame más", type: "dangerous" }
        ];
    }
    
    // ========== INICIALIZACIÓN ==========
    
    initializeConversation() {
        // Seleccionar un hilo aleatorio para comenzar
        const threadKeys = Object.keys(this.conversationThreads);
        this.currentThread = threadKeys[Math.floor(Math.random() * threadKeys.length)];
        
        const initialState = this.conversationThreads[this.currentThread]['presentacion'];
        const initialMessage = initialState.message;
        
        this.conversationHistory.push({
            sender: 'bot',
            message: initialMessage,
            state: 'presentacion',
            thread: this.currentThread,
            timestamp: Date.now()
        });
    }
    
    // ========== CLASIFICACIÓN DE RESPUESTAS ==========
    
    classifyResponse(playerMessage) {
        const message = playerMessage.toLowerCase().trim();
        
        if (!message) {
            return { type: 'neutral', confidence: 0.1 };
        }
        
        // Verificar frases completas primero (mayor prioridad)
        for (const phrase of this.keywordClassifier.safe.phrases) {
            if (message.includes(phrase.toLowerCase())) {
                return { type: 'safe', confidence: 0.95 };
            }
        }
        
        for (const phrase of this.keywordClassifier.dangerous.phrases) {
            if (message.includes(phrase.toLowerCase())) {
                return { type: 'dangerous', confidence: 0.95 };
            }
        }
        
        // Contar coincidencias de palabras clave
        let safeCount = 0;
        let dangerousCount = 0;
        let neutralCount = 0;
        
        for (const keyword of this.keywordClassifier.safe.keywords) {
            if (message.includes(keyword.toLowerCase())) {
                safeCount++;
            }
        }
        
        for (const keyword of this.keywordClassifier.dangerous.keywords) {
            if (message.includes(keyword.toLowerCase())) {
                dangerousCount++;
            }
        }
        
        for (const keyword of this.keywordClassifier.neutral.keywords) {
            if (message.includes(keyword.toLowerCase())) {
                neutralCount++;
            }
        }
        
        // Determinar clasificación basada en el conteo
        if (safeCount > dangerousCount && safeCount > 0) {
            return { type: 'safe', confidence: Math.min(0.9, safeCount * 0.25) };
        } else if (dangerousCount > safeCount && dangerousCount > 0) {
            return { type: 'dangerous', confidence: Math.min(0.9, dangerousCount * 0.25) };
        } else if (neutralCount > 0) {
            return { type: 'neutral', confidence: 0.5 };
        }
        
        return { type: 'neutral', confidence: 0.3 };
    }
    
    // ========== PROCESAMIENTO DE RESPUESTAS ==========
    
    processPlayerResponse(playerMessage) {
        this.attemptsCount++;
        
        // Clasificar respuesta
        const classification = this.classifyResponse(playerMessage);
        
        // Rastrear respuestas seguras consecutivas
        if (classification.type === 'safe') {
            this.consecutiveSafeResponses++;
        } else {
            this.consecutiveSafeResponses = 0;
        }
        
        // Guardar en historial
        this.conversationHistory.push({
            sender: 'player',
            message: playerMessage,
            classification: classification.type,
            state: this.currentState,
            thread: this.currentThread,
            timestamp: Date.now()
        });
        
        // Calcular impacto en el juego
        const gameImpact = this.calculateGameImpact(classification);
        
        // Actualizar estado del juego
        this.updateGameState(gameImpact);
        
        // Transición de estado y generación de respuesta del bot
        const botResponse = this.transitionStateAndGenerateResponse(classification);
        
        // Guardar respuesta del bot
        this.conversationHistory.push({
            sender: 'bot',
            message: botResponse,
            state: this.currentState,
            thread: this.currentThread,
            timestamp: Date.now()
        });
        
        // Verificar si el juego debe terminar
        const gameStatus = this.checkGameStatus();
        
        return {
            botMessage: botResponse,
            classification: classification.type,
            gameImpact: gameImpact,
            currentState: this.currentState,
            currentThread: this.currentThread,
            gameStatus: gameStatus,
            feedback: this.generateFeedback(classification)
        };
    }
    
    // ========== TRANSICIÓN DE ESTADOS CONTEXTUAL ==========
    
    transitionStateAndGenerateResponse(classification) {
        // Verificar si estamos en un estado final
        if (this.finalStates[this.currentState]) {
            const finalState = this.finalStates[this.currentState];
            
            if (finalState.isFinal) {
                // Ya estamos en un estado final, no cambiar
                return this.getRandomFromArray(finalState.messages);
            }
            
            // Estados finales con transición
            const nextState = finalState.nextStates[classification.type] || 'retirada';
            this.currentState = nextState;
            
            if (this.finalStates[nextState]) {
                return this.getRandomFromArray(this.finalStates[nextState].messages);
            }
        }
        
        // Obtener el estado actual del hilo de conversación
        const currentThreadData = this.conversationThreads[this.currentThread];
        const currentStateData = currentThreadData[this.currentState];
        
        if (!currentStateData) {
            // Si no hay datos del estado actual, ir a retirada
            this.currentState = 'retirada';
            return this.getRandomFromArray(this.finalStates.retirada.messages);
        }
        
        // Determinar el siguiente estado basado en la clasificación
        const nextState = currentStateData.nextStates[classification.type];
        
        if (!nextState) {
            // Si no hay siguiente estado definido, mantener el actual
            return this.getResponseForCurrentState(currentStateData);
        }
        
        // Transicionar al siguiente estado
        this.currentState = nextState;
        
        // Verificar si el siguiente estado es un estado final
        if (this.finalStates[nextState]) {
            return this.getRandomFromArray(this.finalStates[nextState].messages);
        }
        
        // Obtener respuesta del nuevo estado
        const nextStateData = currentThreadData[nextState];
        
        if (!nextStateData) {
            // Si no existe el estado, ir a retirada
            this.currentState = 'retirada';
            return this.getRandomFromArray(this.finalStates.retirada.messages);
        }
        
        return this.getResponseForCurrentState(nextStateData);
    }
    
    getResponseForCurrentState(stateData) {
        if (stateData.message) {
            return stateData.message;
        } else if (stateData.messages) {
            return this.getRandomFromArray(stateData.messages);
        }
        return "..."; // Fallback
    }
    
    getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    // ========== CÁLCULO DE IMPACTO ==========
    
    calculateGameImpact(classification) {
        let scoreChange = 0;
        let suspicionChange = 0;
        
        switch (classification.type) {
            case 'safe':
                scoreChange = Math.round(120 * classification.confidence);
                suspicionChange = 18;
                break;
            case 'dangerous':
                scoreChange = Math.round(-150 * classification.confidence);
                suspicionChange = 3;
                break;
            case 'neutral':
                scoreChange = 0;
                suspicionChange = 10;
                break;
        }
        
        return {
            scoreChange: scoreChange,
            suspicionChange: suspicionChange
        };
    }
    
    updateGameState(impact) {
        this.playerScore += impact.scoreChange;
        this.suspicionLevel += impact.suspicionChange;
        
        // Limitar valores
        this.playerScore = Math.max(0, Math.min(2500, this.playerScore));
        this.suspicionLevel = Math.max(0, Math.min(100, this.suspicionLevel));
    }
    
    // ========== VERIFICACIÓN DE ESTADO DEL JUEGO ==========
    
    checkGameStatus() {
        // Victoria por alta sospecha del estafador
        if (this.suspicionLevel >= 100) {
            return { 
                status: 'victory', 
                reason: '¡El estafador se rindió! Tu precaución lo hizo desistir.' 
            };
        }
        
        // Victoria por respuestas seguras consecutivas
        if (this.consecutiveSafeResponses >= 5) {
            return { 
                status: 'victory', 
                reason: '¡Perfecta defensa! Mantuviste tu seguridad en todo momento.' 
            };
        }
        
        // Derrota por caer en la trampa
        if (this.currentState === 'exito_estafador') {
            return { 
                status: 'defeat', 
                reason: 'Caíste en la trampa del estafador. ¡Aprende de esta experiencia!' 
            };
        }
        
        // Derrota por puntuación muy baja
        if (this.playerScore <= 100) {
            return { 
                status: 'defeat', 
                reason: 'Cometiste demasiados errores y comprometiste tu seguridad.' 
            };
        }
        
        // El estafador se retiró
        if (this.currentState === 'retirada') {
            return { 
                status: 'victory', 
                reason: '¡El estafador se retiró! Tu cautela lo ahuyentó.' 
            };
        }
        
        // Completado por máximo de intentos
        if (this.attemptsCount >= this.maxAttempts) {
            if (this.playerScore >= 1000) {
                return { 
                    status: 'victory', 
                    reason: '¡Completaste el juego exitosamente! Mantuviste tu seguridad.' 
                };
            } else {
                return { 
                    status: 'completed', 
                    reason: 'Completaste el juego. Podrías mejorar tu cautela.' 
                };
            }
        }
        
        return { status: 'ongoing', reason: 'Continúa jugando' };
    }
    
    // ========== RETROALIMENTACIÓN EDUCATIVA ==========
    
    generateFeedback(classification) {
        const feedback = {
            safe: {
                messages: [
                    "¡Excelente respuesta! 🛡️",
                    "¡Muy bien! Esa fue una respuesta segura 👍",
                    "¡Perfecto! Mantuviste tu seguridad 🔒"
                ],
                tips: [
                    "Mantuviste tu información segura",
                    "Identificaste correctamente el intento de fraude",
                    "Tu precaución es tu mejor defensa",
                    "Nunca compartas datos personales sin verificar"
                ],
                color: 'safe'
            },
            dangerous: {
                messages: [
                    "⚠️ ¡Cuidado! Esta respuesta es peligrosa",
                    "❌ ¡Atención! Respuesta de alto riesgo",
                    "🚨 ¡Alerta! Esta respuesta puede comprometerte"
                ],
                tips: [
                    "Nunca compartas información sensible por mensajes",
                    "Los servicios legítimos no solicitan datos así",
                    "Verifica siempre la identidad del remitente",
                    "Desconfía de ofertas demasiado buenas"
                ],
                color: 'dangerous'
            },
            neutral: {
                messages: [
                    "💡 Respuesta neutral",
                    "🤔 Puedes ser más cauteloso",
                    "⚠️ Mantente alerta"
                ],
                tips: [
                    "Puedes ser más cauteloso con tus respuestas",
                    "No des información sin verificar primero",
                    "Pregunta por canales oficiales",
                    "Investiga antes de responder"
                ],
                color: 'neutral'
            }
        };
        
        const baseFeedback = feedback[classification.type];
        const randomMessage = baseFeedback.messages[Math.floor(Math.random() * baseFeedback.messages.length)];
        const randomTip = baseFeedback.tips[Math.floor(Math.random() * baseFeedback.tips.length)];
        
        return {
            message: randomMessage,
            tip: randomTip,
            color: baseFeedback.color,
            type: classification.type
        };
    }
    
    // ========== MÉTODOS PÚBLICOS ==========
    
    getGameState() {
        return {
            score: this.playerScore,
            suspicion: this.suspicionLevel,
            attempts: this.attemptsCount,
            maxAttempts: this.maxAttempts,
            currentState: this.currentState,
            currentThread: this.currentThread,
            conversationLength: this.conversationHistory.length,
            consecutiveSafeResponses: this.consecutiveSafeResponses
        };
    }
    
    getConversationHistory() {
        return this.conversationHistory;
    }
    
    getInitialMessage() {
        if (this.conversationHistory.length > 0) {
            return this.conversationHistory[0].message;
        }
        return null;
    }
    
    getCurrentThreadName() {
        const threadNames = {
            'verificacion_whatsapp': 'Verificación de WhatsApp',
            'premio_sorteo': 'Premio / Sorteo',
            'trabajo_remoto': 'Oportunidad de Trabajo',
            'alerta_bancaria': 'Alerta Bancaria'
        };
        
        return threadNames[this.currentThread] || 'Conversación';
    }
    
    reset() {
        this.currentState = 'presentacion';
        this.currentThread = null;
        this.conversationHistory = [];
        this.suspicionLevel = 0;
        this.playerScore = 1000;
        this.attemptsCount = 0;
        this.consecutiveSafeResponses = 0;
        this.initializeConversation();
    }
}

// Exportar para uso en otros archivos
if (typeof window !== 'undefined') {
    window.PhishingChatbot = PhishingChatbot;
}