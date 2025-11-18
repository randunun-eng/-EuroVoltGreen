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
            // Get response from knowledge base
            const response = this.getKnowledgeBaseResponse(message);

            // Simulate thinking delay
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

            // Remove typing indicator
            this.hideTypingIndicator();

            // Add bot response
            this.addMessage(response, 'bot');

            // Save to history
            this.saveMessage(message, response);

        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            this.addMessage(this.getTranslation('error'), 'bot');
        }
    }

    getKnowledgeBaseResponse(userMessage) {
        const message = userMessage.toLowerCase();

        // Knowledge base responses
        const knowledgeBase = {
            en: {
                'mppt': 'MPPT (Maximum Power Point Tracking) is an advanced technology that optimizes solar panel output by continuously adjusting to find the maximum power point. Our EV-MPPT controllers offer up to 99.8% efficiency and can increase energy harvest by 20-30% compared to PWM controllers. Would you like to know more about our MPPT controller range?',
                'pwm': 'PWM (Pulse Width Modulation) controllers are reliable, cost-effective charge controllers ideal for smaller solar systems. They work by gradually reducing the charging current as the battery reaches full charge. Our EV-PWM series offers excellent protection features and is perfect for 12V/24V systems up to 60A.',
                'hybrid': 'Hybrid inverters combine the functionality of both grid-tie and off-grid inverters with battery storage capability. Our MEGA series hybrid inverters feature dual MPPT trackers, touchscreen displays, and can seamlessly switch between solar, battery, and grid power. They\'re ideal for homes wanting energy independence with grid backup. Check out our MEGA-6KW, MEGA-8KW, and MEGA-10KW models!',
                'inverter': 'We manufacture three types of inverters: Hybrid (MEGA/MAGIC series) for flexible power management, On-Grid (MATE series) for direct grid connection, and Off-Grid (META/PV series) for standalone systems. Each is designed for specific applications. What\'s your use case?',
                'price|cost|quote': 'For detailed pricing and quotes, please visit our contact page or email us at info@eurovolt.com. Prices vary based on quantity, customization, and shipping location. Our team will provide competitive OEM/ODM pricing for your specific needs.',
                'warranty': 'Our products come with comprehensive warranties: 5 years for hybrid and MPPT controllers, 3 years for PWM controllers, and 2-5 years for inverters depending on the model. Extended warranties are available. All products include global technical support.',
                'certification': 'Eurovolt products are certified to international standards including CE, UL, TUV, IEC 62109, and ISO 9001. Our manufacturing facilities maintain ISO 14001 environmental certification and follow strict quality control processes.',
                'oem|odm': 'Yes! We offer both OEM (Original Equipment Manufacturing) and ODM (Original Design Manufacturing) services. We work with major global solar brands and can customize products to your specifications including branding, packaging, and technical modifications. Contact us to discuss your requirements!',
                'shipping|delivery': 'We ship worldwide from our Shenzhen facility. Lead times vary: 15-20 days for standard products, 25-35 days for OEM/ODM orders. We work with all major freight forwarders and can arrange door-to-door delivery. Contact us for specific shipping quotes.',
                'company|about': 'Eurovolt is a leading solar electronics manufacturer based in Shenzhen, China. We specialize in high-efficiency solar inverters and charge controllers with cutting-edge MPPT technology. Our 50,000+ sqm facility houses 15+ production lines and advanced R&D labs. We partner with brands like NEXT, POWMr, SUMRy, EASUN, MUST, and ANERN.',
                'contact': 'You can reach us at: Email: info@eurovolt.com | Phone: +86 755 1234 5678 | Location: Shenzhen, China. Visit our Contact page for a detailed inquiry form, and our team will respond within 24 hours!',
                'difference': 'MPPT controllers are 20-30% more efficient and work with higher voltage panels (up to 800V), while PWM is more economical for smaller 12V/24V systems. Hybrid inverters combine solar, battery, and grid capabilities, while on-grid connects only to grid and off-grid works standalone. Choose based on your system size and requirements!',
                'battery': 'Our inverters and controllers support both Lithium-ion and Lead-acid batteries. MEGA series features intelligent battery management with temperature compensation and multi-stage charging. For optimal performance, we recommend lithium batteries for larger systems and deep-cycle lead-acid for smaller applications.',
                'installation': 'All our products come with detailed installation manuals and technical support. We recommend professional installation for larger systems (>5kW). Our technical team provides remote support, and we offer installation training for partners. Safety certifications ensure compliance with local electrical codes.',
                'monitoring': 'Most of our products feature WiFi monitoring capabilities. You can track performance, energy production, battery status, and system alerts through mobile apps (iOS/Android) or web interfaces. Cloud connectivity enables remote diagnostics and firmware updates.'
            },
            zh: {
                'mppt': 'MPPT（最大功率点跟踪）是一种先进技术，通过持续调整找到最大功率点来优化太阳能板输出。我们的EV-MPPT控制器效率高达99.8%，与PWM控制器相比可提高20-30%的能量收集。您想了解更多关于我们的MPPT控制器系列吗？',
                'pwm': 'PWM（脉宽调制）控制器是可靠且经济实惠的充电控制器，非常适合小型太阳能系统。它们通过在电池达到满电时逐渐减少充电电流来工作。我们的EV-PWM系列提供出色的保护功能，非常适合12V/24V系统，最高可达60A。',
                'hybrid': '混合逆变器结合了并网和离网逆变器的功能以及电池存储能力。我们的MEGA系列混合逆变器具有双MPPT跟踪器、触摸屏显示，可以在太阳能、电池和电网电源之间无缝切换。它们非常适合希望能源独立并具有电网备份的家庭。查看我们的MEGA-6KW、MEGA-8KW和MEGA-10KW型号！',
                'inverter': '我们生产三种类型的逆变器：混合型（MEGA/MAGIC系列）用于灵活的电源管理，并网型（MATE系列）用于直接连接电网，离网型（META/PV系列）用于独立系统。每种都是为特定应用设计的。您的使用场景是什么？',
                'price|cost|quote': '有关详细定价和报价，请访问我们的联系页面或发送电子邮件至info@eurovolt.com。价格因数量、定制和运输地点而异。我们的团队将为您的特定需求提供有竞争力的OEM/ODM定价。',
                'warranty': '我们的产品提供全面保修：混合型和MPPT控制器5年，PWM控制器3年，逆变器2-5年（取决于型号）。可提供延长保修。所有产品均包含全球技术支持。',
                'oem|odm': '是的！我们提供OEM（原始设备制造）和ODM（原始设计制造）服务。我们与全球主要太阳能品牌合作，可以根据您的规格定制产品，包括品牌、包装和技术修改。联系我们讨论您的要求！',
                'company|about': 'Eurovolt是一家位于中国深圳的领先太阳能电子制造商。我们专注于高效太阳能逆变器和具有尖端MPPT技术的充电控制器。我们的50,000+平方米设施拥有15+条生产线和先进的研发实验室。',
                'contact': '您可以通过以下方式联系我们：电子邮件：info@eurovolt.com | 电话：+86 755 1234 5678 | 地址：中国深圳。访问我们的联系页面获取详细的咨询表格，我们的团队将在24小时内回复！'
            }
        };

        const responses = knowledgeBase[this.currentLanguage] || knowledgeBase.en;

        // Find matching response
        for (const [keywords, response] of Object.entries(responses)) {
            const keywordList = keywords.split('|');
            if (keywordList.some(keyword => message.includes(keyword))) {
                return response;
            }
        }

        // Default response
        const defaults = {
            en: "Thank you for your question! I'm here to help with information about our solar inverters, MPPT controllers, PWM controllers, and OEM/ODM services. For specific technical questions or quotes, please visit our Contact page or email info@eurovolt.com. How can I assist you with solar technology today?",
            zh: "感谢您的提问！我在这里帮助您了解我们的太阳能逆变器、MPPT控制器、PWM控制器和OEM/ODM服务。如有具体技术问题或报价需求，请访问我们的联系页面或发送电子邮件至info@eurovolt.com。今天我如何帮助您了解太阳能技术？",
            es: "¡Gracias por su pregunta! Estoy aquí para ayudarle con información sobre nuestros inversores solares, controladores MPPT, controladores PWM y servicios OEM/ODM. Para preguntas técnicas específicas o cotizaciones, visite nuestra página de Contacto o envíe un correo a info@eurovolt.com.",
            de: "Vielen Dank für Ihre Frage! Ich bin hier, um Ihnen bei Informationen zu unseren Solarwechselrichtern, MPPT-Controllern, PWM-Controllern und OEM/ODM-Services zu helfen. Für spezifische technische Fragen oder Angebote besuchen Sie bitte unsere Kontaktseite oder senden Sie eine E-Mail an info@eurovolt.com.",
            fr: "Merci pour votre question ! Je suis là pour vous aider avec des informations sur nos onduleurs solaires, contrôleurs MPPT, contrôleurs PWM et services OEM/ODM. Pour des questions techniques spécifiques ou des devis, visitez notre page Contact ou envoyez un e-mail à info@eurovolt.com."
        };

        return defaults[this.currentLanguage] || defaults.en;
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
