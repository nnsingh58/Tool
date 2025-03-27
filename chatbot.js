// chatbot.js
document.addEventListener('DOMContentLoaded', () => {
    // Chatbot HTML Inject Karna
    const chatbotHTML = `
        <div id="chatbot" style="position: fixed; bottom: 70px; right: 20px; width: 350px; height: 500px; background: #fff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); display: none; flex-direction: column; z-index: 1000;">
            <div style="background: #ff6b6b; color: white; padding: 10px; border-radius: 10px 10px 0 0; font-weight: bold; display: flex; justify-content: space-between;">
                HARSHU - Your Assistant
                <select id="language-select" style="background: #fff; color: #000; border: none; padding: 2px;">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                </select>
            </div>
            <div id="chat-messages" style="flex: 1; padding: 10px; overflow-y: auto;"></div>
            <div id="faq-list" style="max-height: 150px; overflow-y: auto; padding: 10px; border-top: 1px solid #ddd; display: none;">
                <strong>FAQs:</strong><br>
            </div>
            <div style="display: flex; padding: 10px; border-top: 1px solid #ddd; background: #fff; border-radius: 0 0 10px 10px;">
                <input id="chat-input" type="text" placeholder="Ask me anything..." style="flex: 1; padding: 5px; border: none; outline: none;" />
                <button id="chat-send" style="background: #ff6b6b; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer; margin-left: 5px; font-size: 14px; z-index: 1001;">Send</button>
            </div>
        </div>
        <button id="chat-toggle" style="position: fixed; bottom: 20px; right: 20px; background: #ff6b6b; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; z-index: 1000;">💬</button>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Elements Select Karna
    const chatbot = document.getElementById('chatbot');
    const chatToggle = document.getElementById('chat-toggle');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const faqList = document.getElementById('faq-list');
    const langSelect = document.getElementById('language-select');

    // Language Default
    let currentLang = 'en';

    // Toggle Chatbot Visibility
    let isFirstOpen = true;
    chatToggle.addEventListener('click', () => {
        chatbot.style.display = chatbot.style.display === 'none' ? 'flex' : 'none';
        if (isFirstOpen && chatbot.style.display === 'flex') {
            addMessage('Harshu', currentLang === 'en' ? 'Hello, I am Harshu! How can I assist you today? Click an FAQ below or ask me anything!' : 'हाय, मैं हर्षु हूँ! मैं आपकी आज कैसे मदद कर सकता हूँ? नीचे FAQ पर क्लिक करें या मुझसे कुछ भी पूछें!');
            showFAQs();
            isFirstOpen = false;
        }
    });

    // Language Change
    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        chatMessages.innerHTML = '';
        addMessage('Harshu', currentLang === 'en' ? 'Language changed to English. How can I assist you?' : 'भाषा हिंदी में बदली गई। मैं आपकी कैसे मदद कर सकता हूँ?');
        showFAQs();
    });

    // Tool-Specific Responses and FAQs (English and Hindi)
    const responses = {
        // Image Compression
        "image compression": {
            en: "Our Image Compression tool reduces image size (JPG, PNG, GIF) without losing quality. Great for website speed and SEO!",
            hi: "हमारा इमेज कम्प्रेशन टूल इमेज साइज (JPG, PNG, GIF) को क्वालिटी खोए बिना कम करता है। वेबसाइट स्पीड और SEO के लिए शानदार!"
        },
        "faq:image compression:1": { en: "What formats does it support?", hi: "यह किन फॉर्मेट्स को सपोर्ट करता है?", ans: { en: "JPG, PNG, GIF.", hi: "JPG, PNG, GIF।" } },
        "faq:image compression:2": { en: "What’s the max size?", hi: "अधिकतम साइज क्या है?", ans: { en: "Output width is max 800px.", hi: "आउटपुट चौड़ाई अधिकतम 800px है।" } },
        "faq:image compression:3": { en: "Does it affect quality?", hi: "क्या यह क्वालिटी को प्रभावित करता है?", ans: { en: "No, it maintains quality at 70% default.", hi: "नहीं, यह 70% डिफॉल्ट पर क्वालिटी बनाए रखता है।" } },
        "faq:image compression:4": { en: "How to upload?", hi: "अपलोड कैसे करें?", ans: { en: "Drag or click the box.", hi: "बॉक्स में ड्रैग करें या क्लिक करें।" } },
        "faq:image compression:5": { en: "Is it free?", hi: "क्या यह मुफ्त है?", ans: { en: "Yes, completely free!", hi: "हाँ, पूरी तरह मुफ्त!" } },
        "faq:image compression:6": { en: "What’s the output format?", hi: "आउटपुट फॉर्मेट क्या है?", ans: { en: "JPEG.", hi: "JPEG।" } },
        "faq:image compression:7": { en: "Can I compress multiple images?", hi: "क्या मैं कई इमेज कम्प्रेस कर सकता हूँ?", ans: { en: "One at a time currently.", hi: "फिलहाल एक बार में एक।" } },
        "faq:image compression:8": { en: "How fast is it?", hi: "यह कितना तेज है?", ans: { en: "Instant for small files!", hi: "छोटी फाइलों के लिए तुरंत!" } },
        "faq:image compression:9": { en: "Is it secure?", hi: "क्या यह सुरक्षित है?", ans: { en: "Yes, files are not stored.", hi: "हाँ, फाइलें स्टोर नहीं होतीं।" } },
        "faq:image compression:10": { en: "Why use it?", hi: "इसे क्यों इस्तेमाल करें?", ans: { en: "Boosts website speed and SEO.", hi: "वेबसाइट स्पीड और SEO को बढ़ाता है।" } },

        // PDF to Word
        "pdf to word": { en: "Convert PDFs to editable Word docs instantly.", hi: "PDF को संपादन योग्य वर्ड डॉक में तुरंत बदलें।" },
        "faq:pdf to word:1": { en: "Does it keep formatting?", hi: "क्या यह फॉर्मेटिंग रखता है?", ans: { en: "Basic formatting is preserved.", hi: "बेसिक फॉर्मेटिंग बरकरार रहती है।" } },
        "faq:pdf to word:2": { en: "What file size limit?", hi: "फाइल साइज की सीमा क्या है?", ans: { en: "Depends on browser, usually 10MB.", hi: "ब्राउज़र पर निर्भर, आमतौर पर 10MB।" } },
        "faq:pdf to word:3": { en: "How to convert?", hi: "कैसे कन्वर्ट करें?", ans: { en: "Upload PDF and click Convert.", hi: "PDF अपलोड करें और कन्वर्ट पर क्लिक करें।" } },
        "faq:pdf to word:4": { en: "Is it free?", hi: "क्या यह मुफ्त है?", ans: { en: "Yes!", hi: "हाँ!" } },
        "faq:pdf to word:5": { en: "Does it work with scanned PDFs?", hi: "क्या यह स्कैन किए PDF के साथ काम करता है?", ans: { en: "Only text-based PDFs.", hi: "केवल टेक्स्ट-आधारित PDF।" } },
        "faq:pdf to word:6": { en: "How fast is conversion?", hi: "कन्वर्जन कितना तेज है?", ans: { en: "A few seconds!", hi: "कुछ सेकंड!" } },
        "faq:pdf to word:7": { en: "Can I edit after conversion?", hi: "कन्वर्जन के बाद संपादन कर सकता हूँ?", ans: { en: "Yes, fully editable.", hi: "हाँ, पूरी तरह संपादन योग्य।" } },
        "faq:pdf to word:8": { en: "Is it secure?", hi: "क्या यह सुरक्षित है?", ans: { en: "Yes, no data stored.", hi: "हाँ, कोई डेटा स्टोर नहीं होता।" } },
        "faq:pdf to word:9": { en: "What’s the output format?", hi: "आउटपुट फॉर्मेट क्या है?", ans: { en: "DOCX.", hi: "DOCX।" } },
        "faq:pdf to word:10": { en: "Why use it?", hi: "इसे क्यों इस्तेमाल करें?", ans: { en: "Edit PDFs easily!", hi: "PDF को आसानी से संपादित करें!" } },

        // Add remaining 10 tools similarly (sample for 2 given due to space)
        "default": { en: "Sorry, I can’t answer that right now. I’ve notified the team!", hi: "माफ करें, मैं अभी इसका जवाब नहीं दे सकता। टीम को सूचित कर दिया गया है!" }
    };

    // Function to Show FAQs
    function showFAQs() {
        faqList.style.display = 'block';
        faqList.innerHTML = '<strong>FAQs:</strong><br>';
        Object.keys(responses).forEach(key => {
            if (key.startsWith('faq:')) {
                const faqDiv = document.createElement('div');
                faqDiv.style.cursor = 'pointer';
                faqDiv.style.color = '#007bff';
                faqDiv.style.margin = '5px 0';
                faqDiv.innerText = responses[key][currentLang];
                faqDiv.addEventListener('click', () => {
                    addMessage('You', responses[key][currentLang]);
                    addMessage('Harshu', responses[key].ans[currentLang]);
                });
                faqList.appendChild(faqDiv);
            }
        });
    }

    // Function to Handle Sending Message
    function sendMessage() {
        if (chatInput.value.trim()) {
            const userMessage = chatInput.value.trim().toLowerCase();
            addMessage('You', userMessage);

            let botResponse = responses["default"][currentLang];
            for (let key in responses) {
                if (userMessage.includes(key)) {
                    botResponse = responses[key][currentLang];
                    break;
                }
            }

            addMessage('Harshu', botResponse);

            if (botResponse === responses["default"][currentLang]) {
                sendToTeam(userMessage);
            }

            chatInput.value = '';
        }
    }

    // Handle Enter Key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Handle Send Button Click
    chatSend.addEventListener('click', sendMessage);

    // Add Message to Chat
    function addMessage(sender, message) {
        const msgDiv = document.createElement('div');
        msgDiv.style.marginBottom = '10px';
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send Out-of-Scope Query to Team via Formspree
    async function sendToTeam(query) {
        const formData = new FormData();
        formData.append('message', `Out-of-scope query from Harshu: ${query}`);
        formData.append('email', 'your-email@example.com'); // Apna email yahan daal do

        try {
            const response = await fetch('https://formspree.io/f/xpwpjwrz', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                addMessage('Harshu', currentLang === 'en' ? 'Your query has been forwarded to our team!' : 'आपका सवाल हमारी टीम को भेज दिया गया है!');
            }
        } catch (error) {
            console.error('Error sending to team:', error);
            addMessage('Harshu', currentLang === 'en' ? 'Error forwarding your query!' : 'आपका सवाल भेजने में त्रुटि!');
        }
    }
});
