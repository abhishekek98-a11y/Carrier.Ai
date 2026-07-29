// frontend/js/chatbot.js
import { api, isAuthenticated } from './api.js';

let chatOpen = false;

export function initChatbot() {
    if (!isAuthenticated()) {
        document.getElementById('chatbot-widget').classList.add('hidden');
        return;
    }
    document.getElementById('chatbot-widget').classList.remove('hidden');

    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const chatForm = document.getElementById('chat-form');
    const panel = document.getElementById('chat-panel');

    toggleBtn.onclick = () => {
        chatOpen = !chatOpen;
        if (chatOpen) {
            panel.classList.remove('hidden');
            panel.classList.add('flex');
            loadHistory();
        } else {
            panel.classList.add('hidden');
            panel.classList.remove('flex');
        }
    };

    closeBtn.onclick = () => {
        chatOpen = false;
        panel.classList.add('hidden');
        panel.classList.remove('flex');
    };

    chatForm.onsubmit = async (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const msg = input.value.trim();
        if (!msg) return;
        input.value = '';
        await sendMessage(msg);
    };

    window.chatbot = { sendQuickMessage };
}

async function sendMessage(message) {
    const messages = document.getElementById('chat-messages');

    // Add user message
    messages.innerHTML += `
        <div class="chat-bubble-user self-end p-3 rounded-2xl rounded-tr-sm text-sm max-w-[85%] animate-fadeIn">
            ${escapeForChat(message)}
        </div>
    `;

    // Show typing indicator
    const typingId = 'typing-' + Date.now();
    messages.innerHTML += `
        <div id="${typingId}" class="self-start bg-white/10 p-3 rounded-2xl rounded-tl-sm max-w-[85%]">
            <div class="typing-indicator flex gap-1">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    scrollChat();

    // Disable input
    const input = document.getElementById('chat-input');
    input.disabled = true;

    try {
        const data = await api.post('/chatbot/ask', { message });
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        messages.innerHTML += `
            <div class="chat-bubble-ai self-start bg-white/10 p-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] animate-fadeIn">
                ${escapeForChat(data.response)}
            </div>
        `;

        // Update suggestions
        if (data.suggestions && data.suggestions.length > 0) {
            const sugContainer = document.getElementById('chat-suggestions');
            sugContainer.innerHTML = data.suggestions.map(s =>
                `<button class="skill-tag text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10 transition-colors whitespace-nowrap" onclick="window.chatbot.sendQuickMessage('${s.replace(/'/g, "\\'")}')">${s}</button>`
            ).join('');
        }
    } catch {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        messages.innerHTML += `
            <div class="self-start bg-red-500/10 p-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] text-red-400 animate-fadeIn">
                Sorry, I couldn't process your request. Please try again.
            </div>
        `;
    } finally {
        input.disabled = false;
        input.focus();
        scrollChat();
    }
}

async function sendQuickMessage(msg) {
    const input = document.getElementById('chat-input');
    if (input.disabled) return;
    if (!chatOpen) {
        const panel = document.getElementById('chat-panel');
        chatOpen = true;
        panel.classList.remove('hidden');
        panel.classList.add('flex');
    }
    await sendMessage(msg);
}

async function loadHistory() {
    try {
        const history = await api.get('/chatbot/history');
        if (history && history.length > 0) {
            const messages = document.getElementById('chat-messages');
            // Keep welcome message, add history
            let html = messages.innerHTML;
            history.forEach(h => {
                html += `
                    <div class="chat-bubble-user self-end p-3 rounded-2xl rounded-tr-sm text-sm max-w-[85%]">${escapeForChat(h.message)}</div>
                    <div class="chat-bubble-ai self-start bg-white/10 p-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%]">${escapeForChat(h.response)}</div>
                `;
            });
            messages.innerHTML = html;
            scrollChat();
        }
    } catch { /* no history */ }
}

function scrollChat() {
    const el = document.getElementById('chat-messages');
    if (el) setTimeout(() => el.scrollTop = el.scrollHeight, 100);
}

function escapeForChat(str) {
    if (!str) return '';
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
