document.addEventListener('DOMContentLoaded', () => {
    const chatbotHTML = `
        <div id="chatbot" style="position: fixed; bottom: 70px; right: 20px; width: 350px; height: 500px; background: #fff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); display: none; flex-direction: column; z-index: 1000;">
            <div style="background: #ff6b6b; color: white; padding: 10px; border-radius: 10px 10px 0 0; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                <span>HARSHU - Your Assistant</span>
                <select id="language-select" style="background: #fff; color: #000; border: none; padding: 2px; font-size: 14px;">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                </select>
            </div>
            <div id="chat-messages" style="flex: 1; padding: 10px; overflow-y: auto;"></div>
            <div id="faq-list" style="max-height: 150px; overflow-y: auto; padding: 10px; border-top: 1px solid #ddd; display: none;"></div>
            <div style="display: flex; padding: 10px; border-top: 1px solid #ddd; background: #fff; border-radius: 0 0 10px 10px;">
                <input id="chat-input" type="text" placeholder="Ask me anything..." style="flex: 1; padding: 5px; border: none; outline: none;" />
                <button id="chat-send" style="background: #ff6b6b; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer; margin-left: 5px; font-size: 14px; z-index: 1001;">Send</button>
            </div>
        </div>
        <button id="chat-toggle" style="position: fixed; bottom: 20px; right: 20px; background: #ff6b6b; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; z-index: 1000;">💬</button>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const chatbot = document.getElementById('chatbot');
    const chatToggle = document.getElementById('chat-toggle');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const faqList = document.getElementById('faq-list');
    const langSelect = document.getElementById('language-select');

    let currentLang = 'en';
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '').replace(/-/g, ' ') || 'index';

    chatToggle.addEventListener('click', () => {
        chatbot.style.display = chatbot.style.display === 'none' ? 'flex' : 'none';
        if (chatbot.style.display === 'flex') {
            addMessage('Harshu', currentLang === 'en' ? `Hello, I am Harshu! Ask me about ${currentPage} or click an FAQ below!` : `हाय, मैं हर्षु हूँ! ${currentPage} के बारे में पूछें या नीचे FAQ पर क्लिक करें!`);
            showFAQs();
        }
    });

    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        chatMessages.innerHTML = '';
        addMessage('Harshu', currentLang === 'en' ? 'Language changed to English.' : 'भाषा हिंदी में बदली गई।');
        showFAQs();
    });

    const responses = {
        "img compress": { en: "Reduce image size without losing quality.", hi: "इमेज साइज कम करें बिना क्वालिटी खोए।" },
        "faq:img compress:1": { en: "Supported formats?", hi: "सपोर्टेड फॉर्मेट?", ans: { en: "JPG, PNG, GIF.", hi: "JPG, PNG, GIF।" } },
        "faq:img compress:2": { en: "How to use?", hi: "कैसे इस्तेमाल करें?", ans: { en: "Upload, compress, download.", hi: "अपलोड करें, कम करें, डाउनलोड करें।" } },
        "faq:img compress:3": { en: "Free?", hi: "मुफ्त?", ans: { en: "Yes!", hi: "हाँ!" } },
        "default": { en: "Sorry, I can’t answer that!", hi: "माफ करें, जवाब नहीं दे सकता!" }
    };

    function showFAQs() {
        faqList.style.display = 'block';
        faqList.innerHTML = '<strong>FAQs:</strong><br>';
        const toolName = currentPage;
        Object.keys(responses).forEach(key => {
            if (key.startsWith(`faq:${toolName}:`)) {
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
            chatInput.value = '';
        }
    }

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    chatSend.addEventListener('click', sendMessage);

    function addMessage(sender, message) {
        const msgDiv = document.createElement('div');
        msgDiv.style.marginBottom = '10px';
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
