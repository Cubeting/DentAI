// File: Frontend/ai-integration.js
// Script untuk integrasi AI yang lebih advanced

class DentAIIntegration {
    constructor() {
        this.chatbotConfig = {
            chatflowid: "0fd0c380-4455-4c5c-8c3b-6dc05dd2f482",
            apiHost: "https://cloud.flowiseai.com",
        };
        this.init();
    }

    async init() {
        // Load chatbot
        await this.loadChatbot();
        
        // Setup event listeners
        this.setupConsultationButtons();
        
        // Setup context-aware suggestions
        this.setupContextualHelp();
    }

    async loadChatbot() {
        try {
            const { default: Chatbot } = await import("https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js");
            
            Chatbot.init({
                ...this.chatbotConfig,
                theme: {
                    button: {
                        backgroundColor: "#3B82F6",
                        right: 20,
                        bottom: 20,
                        size: "medium",
                        iconColor: "white",
                        customIconSrc: "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/chatbot.svg"
                    },
                    chatWindow: {
                        welcomeMessage: "Halo! Saya DentAI Assistant. Ada yang bisa saya bantu tentang kesehatan gigi Anda?",
                        backgroundColor: "#ffffff",
                        height: 500,
                        width: 400,
                        fontSize: 16,
                        botMessage: {
                            backgroundColor: "#f7f8ff",
                            textColor: "#303235",
                        },
                        userMessage: {
                            backgroundColor: "#3B82F6",
                            textColor: "#ffffff",
                        },
                        textInput: {
                            placeholder: "Tanyakan tentang gigi Anda...",
                            backgroundColor: "#ffffff",
                            textColor: "#303235",
                        }
                    }
                }
            });
            
            window.dentAIChatbot = Chatbot;
        } catch (error) {
            console.error('Failed to load chatbot:', error);
        }
    }

    setupConsultationButtons() {
        // Handle semua tombol konsultasi AI
        const consultationButtons = document.querySelectorAll('.ai-consultation-btn, .ai-consult-btn');
        
        consultationButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openChatbotWithContext(button);
            });
        });
    }

    setupContextualHelp() {
        // Deteksi halaman dan berikan konteks yang sesuai
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('dental-diseases-detail')) {
            this.setupDiseasePageContext();
        } else if (currentPage.includes('index') || currentPage === '/') {
            this.setupMainPageContext();
        }
    }

    setupDiseasePageContext() {
        // Tambahkan helper untuk konsultasi spesifik penyakit
        const diseaseCards = document.querySelectorAll('.disease-card-detail');
        
        diseaseCards.forEach(card => {
            const consultBtn = document.createElement('button');
            consultBtn.className = 'quick-consult-btn';
            consultBtn.innerHTML = '🤖 Tanya AI tentang ini';
            consultBtn.style.cssText = `
                background: linear-gradient(45deg, #3B82F6, #1D4ED8);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                margin-top: 10px;
                transition: all 0.3s ease;
            `;
            
            consultBtn.addEventListener('click', () => {
                const diseaseName = card.querySelector('h3').textContent;
                this.startConsultationWithTopic(diseaseName);
            });
            
            card.querySelector('.disease-content').appendChild(consultBtn);
        });
    }

    setupMainPageContext() {
        // Setup untuk halaman utama
        const diseaseCards = document.querySelectorAll('.disease-card');
        
        diseaseCards.forEach(card => {
            card.addEventListener('click', () => {
                const diseaseName = card.querySelector('h3').textContent;
                // Simpan konteks untuk chatbot
                localStorage.setItem('dentai_context', diseaseName);
            });
        });
    }

    openChatbotWithContext(button) {
        // Ambil konteks dari tombol atau halaman
        let context = '';
        
        if (button.closest('.disease-card-detail')) {
            const diseaseName = button.closest('.disease-card-detail').querySelector('h3').textContent;
            context = `Saya ingin berkonsultasi tentang ${diseaseName}`;
        } else if (button.closest('.emergency-card')) {
            context = 'Saya mengalami kondisi darurat gigi';
        }
        
        // Buka chatbot
        if (window.dentAIChatbot) {
            window.dentAIChatbot.open();
            
            // Jika ada konteks, kirim pesan otomatis
            if (context) {
                setTimeout(() => {
                    this.sendContextMessage(context);
                }, 1000);
            }
        }
    }

    startConsultationWithTopic(topic) {
        const message = `Saya ingin tahu lebih lanjut tentang ${topic}. Bisakah Anda menjelaskan gejala, penyebab, dan cara pengobatannya?`;
        
        if (window.dentAIChatbot) {
            window.dentAIChatbot.open();
            setTimeout(() => {
                this.sendContextMessage(message);
            }, 1000);
        }
    }

    sendContextMessage(message) {
        // Fungsi untuk mengirim pesan kontekstual ke chatbot
        // Implementation tergantung pada API Flowise
        console.log('Context message:', message);
        
        // Jika Flowise mendukung, kirim pesan otomatis
        if (window.dentAIChatbot && window.dentAIChatbot.sendMessage) {
            window.dentAIChatbot.sendMessage(message);
        }
    }

    // Method untuk emergency consultation
    startEmergencyConsultation() {
        const emergencyMessage = `Saya mengalami kondisi darurat gigi dengan gejala:
        - Nyeri hebat
        - Pembengkakan
        - Demam
        
        Apa yang harus saya lakukan?`;
        
        this.startConsultationWithTopic('Kondisi Darurat Gigi');
    }
}

// Initialize ketika DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dentAI = new DentAIIntegration();
});

// Export untuk penggunaan di halaman lain
window.DentAIIntegration = DentAIIntegration;