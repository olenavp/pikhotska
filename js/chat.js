document.addEventListener('DOMContentLoaded', () => {
    const N8N_WEBHOOK_URL = 'https://my-n8n-bot-ykn8.onrender.com/webhook-test/site-chat';

    if (!localStorage.getItem('chat_session_id')) {
        localStorage.setItem('chat_session_id', 'user_' + Math.random().toString(36).substring(2, 11));
    }
    const CHAT_USER_ID = localStorage.getItem('chat_session_id');

    // Нові елементи керування віджетом
    const chatWidget = document.getElementById('chatWidget');
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatCloseBtn = document.getElementById('chatCloseBtn');

    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');

    if (!chatMessages || !chatInput || !chatSendBtn || !chatWidget || !chatToggleBtn || !chatCloseBtn) {
        console.error('Chat Widget: Не знайдено необхідних HTML елементів чату.');
        return;
    }

    // ЛОГІКА ПОЯВИ ТА ЗГОРТАННЯ
    // Поява круглої кнопки-бульбашки через 3 секунди після завантаження сторінки
    setTimeout(() => {
        chatToggleBtn.classList.add('visible');
    }, 3000);

    // Відкриття/згортання вікна чату при кліку на бульбашку
    chatToggleBtn.addEventListener('click', () => {
        chatWidget.classList.toggle('hidden');
        if (!chatWidget.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    // Згортання чату при кліку на хрестик у хедері
    chatCloseBtn.addEventListener('click', () => {
        chatWidget.classList.add('hidden');
    });

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('msg', sender);
        msgDiv.innerText = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleSendMessage() {
        const messageText = chatInput.value.trim();
        if (!messageText) return;

        appendMessage(messageText, 'user');
        chatInput.value = '';

        chatInput.disabled = true;
        chatSendBtn.disabled = true;

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: messageText,
                    userId: CHAT_USER_ID
                })
            });

            const botAnswer = await response.text();
            appendMessage(botAnswer, 'bot');

        } catch (error) {
            console.error('Chat Error:', error);
            appendMessage('❌ Ой, щось пішло не так. Спробуйте пізніше.', 'bot');
        } finally {
            chatInput.disabled = false;
            chatSendBtn.disabled = false;
            chatInput.focus();
        }
    }

    chatSendBtn.addEventListener('click', handleSendMessage);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !chatInput.disabled) {
            handleSendMessage();
        }
    });
});