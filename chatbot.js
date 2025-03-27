// chatbot.js
document.addEventListener('DOMContentLoaded', () => {
    // Chatbot HTML Inject Karna
    const chatbotHTML = `
        <div id="chatbot" style="position: fixed; bottom: 20px; right: 20px; width: 300px; height: 400px; background: #fff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); display: none; flex-direction: column; z-index: 1000;">
            <div style="background: #ff6b6b; color: white; padding: 10px; border-radius: 10px 10px 0 0; font-weight: bold;">HARSHU - Your Assistant</div>
            <div id="chat-messages" style="flex: 1; padding: 10px; overflow-y: auto;"></div>
            <div style="display: flex; padding: 10px; border-top: 1px solid #ddd; background: #fff; border-radius: 0 0 10px 10px;">
                <input id="chat-input" type="text" placeholder="Ask me anything..." style="flex: 1; padding: 5px; border: none; outline: none;" />
                <button id="chat-send" style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 5px; font-size: 14px;">Send</button>
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

    // Toggle Chatbot Visibility
    let isFirstOpen = true;
    chatToggle.addEventListener('click', () => {
        chatbot.style.display = chatbot.style.display === 'none' ? 'flex' : 'none';
        if (isFirstOpen && chatbot.style.display === 'flex') {
            addMessage('Harshu', 'Hello, I am Harshu! How can I assist you today? Ask me about any tool!');
            isFirstOpen = false;
        }
    });

    // Tool-Specific Responses and FAQs
    const responses = {
        // General
        "hi": "Hi there! I’m Harshu—how can I help you today? Ask me about any tool!",
        "what tools do you offer": "We offer Image Compression, PDF to Word, Video Converter, Audio Converter, File Compressor, QR Code Generator, Image to PDF, Text to Speech, Voice Translator, and more! Which one would you like to know about?",

        // Image Compression
        "image compression": "Our Image Compression tool reduces image size (JPG, PNG, GIF) without losing quality. It’s great for boosting website speed and SEO. Max width is 800px, and output is JPEG.",
        "how to use image compression": "Upload your image by dragging or clicking the box, then hit 'Compress & Download'. You’ll see original and compressed sizes!",
        "image compression faq": "FAQs: 1) Supports JPG, PNG, GIF. 2) Max output size: 800px width. 3) Quality: 70% default. Want more details?",

        // PDF to Word
        "pdf to word": "Convert PDFs to editable Word docs with our PDF to Word tool. Upload your PDF and download the Word file instantly.",
        "how to use pdf to word": "Just upload your PDF file, and click 'Convert'. Your Word file will be ready to download!",
        "pdf to word faq": "FAQs: 1) Preserves basic formatting. 2) Works with text-based PDFs. 3) Free and fast!",

        // Video Converter
        "video converter": "Change video formats easily with our Video Converter. Supports common formats like MP4, AVI, etc.",
        "how to use video converter": "Upload your video, select the output format, and click 'Convert'. Simple!",
        "video converter faq": "FAQs: 1) Max file size depends on browser. 2) Common formats supported. 3) No quality loss in supported codecs.",

        // Text to Speech
        "text to speech": "Our Text to Speech tool turns text into natural-sounding audio. Perfect for presentations or accessibility!",
        "how to use text to speech": "Type or paste your text, choose a voice if available, and click 'Convert'. Download the audio file!",
        "text to speech faq": "FAQs: 1) Supports multiple languages (browser-dependent). 2) Audio output in MP3. 3) Free with no limits!",

        // General Default
        "default": "Sorry, I can’t answer that right now. I’ve notified the team, and we’ll get back to you within 24-48 hours!"
    };

    // Function to Handle Sending Message
    function sendMessage() {
        if (chatInput.value.trim()) {
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
                addMessage('Harshu', 'Your query has been forwarded to our team!');
            }
        } catch (error) {
            console.error('Error sending to team:', error);
            addMessage('Harshu', 'Error forwarding your query—please try again later.');
        }
    }
});
