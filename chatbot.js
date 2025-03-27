// chatbot.js
document.addEventListener('DOMContentLoaded', () => {
    // Chatbot HTML Inject Karna
    const chatbotHTML = `
        <div id="chatbot" style="position: fixed; bottom: 20px; right: 20px; width: 300px; height: 400px; background: #fff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); display: none; flex-direction: column;">
            <div style="background: #ff6b6b; color: white; padding: 10px; border-radius: 10px 10px 0 0; font-weight: bold;">HARSHU - Your Assistant</div>
            <div id="chat-messages" style="flex: 1; padding: 10px; overflow-y: auto;"></div>
            <input id="chat-input" type="text" placeholder="Ask me anything..." style="width: 100%; padding: 10px; border: none; border-top: 1px solid #ddd; border-radius: 0 0 10px 10px;" />
        </div>
        <button id="chat-toggle" style="position: fixed; bottom: 20px; right: 20px; background: #ff6b6b; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer;">💬</button>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Elements Select Karna
    const chatbot = document.getElementById('chatbot');
    const chatToggle = document.getElementById('chat-toggle');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');

    // Toggle Chatbot Visibility
    let isFirstOpen = true;
    chatToggle.addEventListener('click', () => {
        chatbot.style.display = chatbot.style.display === 'none' ? 'flex' : 'none';
        if (isFirstOpen && chatbot.style.display === 'flex') {
            addMessage('Harshu', 'Hello, I am Harshu! How can I assist you today?');
            isFirstOpen = false;
        }
    });

    // Predefined Responses
    const responses = {
        "image compression": "Our Image Compression tool reduces image size without losing quality. Try it in the Tools section!",
        "pdf to word": "Convert PDFs to editable Word documents easily with our PDF to Word tool.",
        "video converter": "Change video formats effortlessly with our Video Converter.",
        "what tools do you offer": "We offer Image Compression, PDF to Word, Video Converter, Audio Converter, File Compressor, QR Code Generator, and more! Check the Tools section.",
        "hi": "Hi there! I’m Harshu—how can I help you today?",
        "default": "Sorry, I can’t answer that right now. I’ve notified the team, and we’ll get back to you within 24-48 hours!"
    };

    // Handle User Input
    chatInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            const userMessage = chatInput.value.trim().toLowerCase();
            addMessage('You', userMessage);

            let botResponse = responses["default"];
            for (let key in responses) {
                if (userMessage.includes(key)) {
                    botResponse = responses[key];
                    break;
                }
            }

            addMessage('Harshu', botResponse);

            if (botResponse === responses["default"]) {
                await sendToTeam(userMessage);
            }

            chatInput.value = '';
        }
    });

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
                addMessage('Harshu', 'Your query has been forwarded to our team!');
            }
        } catch (error) {
            console.error('Error sending to team:', error);
            addMessage('Harshu', 'Error forwarding your query—please try again later.');
        }
    }
});
