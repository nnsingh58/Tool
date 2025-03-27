document.addEventListener('DOMContentLoaded', () => {
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
    const langSelect = document.getElementById('language-select');

    let currentLang = 'en';

    chatToggle.addEventListener('click', () => {
        chatbot.style.display = chatbot.style.display === 'none' ? 'flex' : 'none';
        if (chatbot.style.display === 'flex') {
            addMessage('Harshu', currentLang === 'en' ? 'Hello, I am Harshu!' : 'हाय, मैं हर्षु हूँ!');
        }
    });

    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        chatMessages.innerHTML = '';
        addMessage('Harshu', currentLang === 'en' ? 'Language changed to English.' : 'भाषा हिंदी में बदली गई।');
    });

    function addMessage(sender, message) {
        const msgDiv = document.createElement('div');
        msgDiv.style.marginBottom = '10px';
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        if (chatInput.value.trim()) {
            addMessage('You', chatInput.value);
            addMessage('Harshu', currentLang === 'en' ? 'Thanks for your message!' : 'आपके संदेश के लिए धन्यवाद!');
            chatInput.value = '';
        }
    }

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    chatSend.addEventListener('click', sendMessage);
});
