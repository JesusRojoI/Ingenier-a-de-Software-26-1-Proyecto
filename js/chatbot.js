class PhishingChatbot {
    constructor(scenario = 'whatsapp') {
        this.scenario = scenario;
        this.currentState = 'inicio';
        this.conversationHistory = [];
        this.suspicionLevel = 0;
        this.playerScore = 1000;
        this.attemptsCount = 0;
        this.maxAttempts = 8;
        
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
            }
        };
    }
    
    // Métodos adicionales para manejar la lógica del chatbot irían aquí
}
