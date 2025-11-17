// AI Chatbot for Eurovolt website using Gemini API
class EurovoltChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentLanguage = this.getCurrentLanguage();
        this.isTyping = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadChatHistory();
        this.showWelcomeMessage();
    }

    getCurrentLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('lang') || 'en';
    }

    getTranslation(key) {
        const translations = {
            'en': {
                'welcome': 'Hi! I\'m your solar energy assistant. How can I help you today?',
                'placeholder': 'Ask about solar technology...',
                'send': 'Send',
                'typing': 'Assistant is typing...',
                'error': 'Sorry, I\'m having trouble connecting. Please try again.',
                'examples': [
                    'What is MPPT technology?',
                    'Which inverter is best for home use?',
                    'How do solar charge controllers work?',
                    'What are the benefits of hybrid inverters?'
                ]
            },
            'zh': {
                'welcome': '您好！我是您的太阳能助手。今天我能为您做些什么？',
                'placeholder': '询问太阳能技术...',
                'send': '发送',
                'typing': '助手正在输入...',
                'error': '抱歉，连接出现问题。请重试。',
                'examples': [
                    '什么是MPPT技术？',
                    '哪种逆变器最适合家用？',
                    '太阳能充电控制器如何工作？',
                    '混合逆变器有什么优势？'
                ]
            }
        };
        
        return translations[this.currentLanguage]?.[key] || translations['en'][key];
    }

    bindEvents() {
        const chatToggle = document.getElementById('chatToggle');
        const chatClose = document.getElementById('chatClose');
        const chatSend = document.getElementById('chatSend');
        const chatInput = document.getElementById('chatInput');
        const chatbot = document.getElementById('chatbot');

        if (chatToggle) {
            chatToggle.addEventListener('click', () => this.toggleChat());
        }

        if (chatClose) {
            chatClose.addEventListener('click', () => this.closeChat());
        }

        if (chatSend) {
            chatSend.addEventListener('click', () => this.sendMessage());
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            chatInput.addEventListener('input', () => {
                this.adjustInputHeight();
            });
        }

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !chatbot.contains(e.target) && !e.target.closest('#chatToggle')) {
                this.closeChat();
            }
        });

        // Handle language changes
        const languageDropdown = document.querySelector('.dropdown-menu');
        if (languageDropdown) {
            languageDropdown.addEventListener('click', (e) => {
                if (e.target.classList.contains('dropdown-item')) {
                    const newLang = e.target.getAttribute('href').split('lang=')[1];
                    if (newLang !== this.currentLanguage) {
                        this.currentLanguage = newLang;
                        this.updateLanguage();
                    }
                }
            });
        }
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatbot = document.getElementById('chatbot');
        if (chatbot) {
            chatbot.style.display = 'flex';
            this.isOpen = true;
            
            // Focus on input
            setTimeout(() => {
                const chatInput = document.getElementById('chatInput');
                if (chatInput) {
                    chatInput.focus();
                }
            }, 300);
        }
    }

    closeChat() {
        const chatbot = document.getElementById('chatbot');
        if (chatbot) {
            chatbot.style.display = 'none';
            this.isOpen = false;
        }
    }

    adjustInputHeight() {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.style.height = 'auto';
            chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
        }
    }

    showWelcomeMessage() {
        this.addMessage(this.getTranslation('welcome'), 'bot');
        this.showQuickActions();
    }

    showQuickActions() {
        const examples = this.getTranslation('examples');
        let quickActionsHTML = '<div class="quick-actions">';
        quickActionsHTML += '<p><small>Try asking:</small></p>';
        
        examples.forEach(example => {
            quickActionsHTML += `<button class="btn btn-sm btn-outline-primary me-2 mb-2 quick-action-btn" onclick="eurovoltChatbot.sendQuickMessage('${example}')">${example}</button>`;
        });
        
        quickActionsHTML += '</div>';
        
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            const quickActionsDiv = document.createElement('div');
            quickActionsDiv.innerHTML = quickActionsHTML;
            messagesContainer.appendChild(quickActionsDiv);
            this.scrollToBottom();
        }
    }

    sendQuickMessage(message) {
        // Remove quick actions
        const quickActions = document.querySelector('.quick-actions');
        if (quickActions) {
            quickActions.remove();
        }
        
        // Set input and send
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.value = message;
            this.sendMessage();
        }
    }

    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;

        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        chatInput.value = '';
        this.adjustInputHeight();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send to backend
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    language: this.currentLanguage
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage(data.response, 'bot');
            
            // Save to history
            this.saveMessage(message, data.response);

        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            this.addMessage(this.getTranslation('error'), 'bot');
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        // Process text for links and formatting
        const processedText = this.processMessageText(text);
        messageDiv.innerHTML = processedText;

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        // Add message to memory
        this.messages.push({ text, sender, timestamp: new Date() });
    }

    processMessageText(text) {
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        
        // Convert email addresses to links
        text = text.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>');
        
        // Convert newlines to breaks
        text = text.replace(/\n/g, '<br>');
        
        // Make product names clickable
        const productNames = ['EV-5000H', 'EV-10000H', 'EV-15000H', 'EV-MPPT-60A', 'EV-MPPT-100A', 'EV-PWM-30A', 'EV-PWM-50A'];
        productNames.forEach(productName => {
            const regex = new RegExp(`\\b${productName}\\b`, 'gi');
            text = text.replace(regex, `<span class="product-mention" onclick="eurovoltChatbot.showProductInfo('${productName}')">${productName}</span>`);
        });
        
        return text;
    }

    showProductInfo(productName) {
        const productUrls = {
            'EV-5000H': '/products#hybrid-inverters',
            'EV-10000H': '/products#hybrid-inverters',
            'EV-15000H': '/products#hybrid-inverters',
            'EV-MPPT-60A': '/products#mppt-controllers',
            'EV-MPPT-100A': '/products#mppt-controllers',
            'EV-PWM-30A': '/products#pwm-controllers',
            'EV-PWM-50A': '/products#pwm-controllers'
        };
        
        const url = productUrls[productName];
        if (url) {
            window.open(url + `?lang=${this.currentLanguage}`, '_blank');
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-animation">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <small>${this.getTranslation('typing')}</small>
        `;
        
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
        this.isTyping = true;

        // Add typing animation CSS if not exists
        this.addTypingAnimationCSS();
    }

    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    addTypingAnimationCSS() {
        if (document.getElementById('typing-animation-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'typing-animation-styles';
        styles.textContent = `
            .typing-animation {
                display: flex;
                align-items: center;
                gap: 4px;
                margin-bottom: 5px;
            }
            
            .typing-animation span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #666;
                animation: typing 1.4s infinite ease-in-out;
            }
            
            .typing-animation span:nth-child(1) {
                animation-delay: -0.32s;
            }
            
            .typing-animation span:nth-child(2) {
                animation-delay: -0.16s;
            }
            
            @keyframes typing {
                0%, 80%, 100% {
                    transform: scale(0);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            .product-mention {
                color: var(--primary-color, #0056b3);
                cursor: pointer;
                text-decoration: underline;
                font-weight: 600;
            }
            
            .product-mention:hover {
                color: var(--secondary-color, #28a745);
            }
            
            .quick-actions {
                margin: 10px 0;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 10px;
            }
            
            .quick-action-btn {
                font-size: 0.8rem;
                padding: 0.25rem 0.5rem;
            }
        `;
        document.head.appendChild(styles);
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    saveMessage(userMessage, botResponse) {
        try {
            let chatHistory = JSON.parse(localStorage.getItem('eurovolt_chat_history') || '[]');
            chatHistory.push({
                userMessage,
                botResponse,
                timestamp: new Date().toISOString(),
                language: this.currentLanguage
            });
            
            // Keep only last 50 messages
            if (chatHistory.length > 50) {
                chatHistory = chatHistory.slice(-50);
            }
            
            localStorage.setItem('eurovolt_chat_history', JSON.stringify(chatHistory));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const chatHistory = JSON.parse(localStorage.getItem('eurovolt_chat_history') || '[]');
            const recentHistory = chatHistory.slice(-5); // Load last 5 conversations
            
            recentHistory.forEach(item => {
                if (item.language === this.currentLanguage) {
                    this.addMessage(item.userMessage, 'user');
                    this.addMessage(item.botResponse, 'bot');
                }
            });
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    updateLanguage() {
        // Clear messages and reinitialize with new language
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        
        this.messages = [];
        this.showWelcomeMessage();
        
        // Update input placeholder
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.placeholder = this.getTranslation('placeholder');
        }
    }

    clearHistory() {
        try {
            localStorage.removeItem('eurovolt_chat_history');
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
            this.messages = [];
            this.showWelcomeMessage();
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    }

    exportChatHistory() {
        try {
            const chatHistory = JSON.parse(localStorage.getItem('eurovolt_chat_history') || '[]');
            const dataStr = JSON.stringify(chatHistory, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = 'eurovolt_chat_history.json';
            link.click();
        } catch (error) {
            console.error('Error exporting chat history:', error);
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.eurovoltChatbot = new EurovoltChatbot();
    console.log('Eurovolt AI Chatbot initialized');
});

// Add chatbot CSS styles
document.addEventListener('DOMContentLoaded', function() {
    const styles = document.createElement('style');
    styles.textContent = `
        /* Enhanced chatbot styles */
        .message.user {
            background: linear-gradient(135deg, #0056b3, #007bff);
            margin-left: 20%;
        }
        
        .message.bot {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            margin-right: 20%;
        }
        
        .chatbot-container {
            transition: all 0.3s ease;
            transform-origin: bottom right;
        }
        
        .chatbot-container.show {
            animation: slideInUp 0.3s ease;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .chatbot-messages::-webkit-scrollbar {
            width: 6px;
        }
        
        .chatbot-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    `;
    document.head.appendChild(styles);
});
