// frontend/js/chatbot.js
import { api, isAuthenticated } from './api.js';

let chatOpen = false;

export function initChatbot() {
    if (!isAuthenticated()) {
        const widget = document.getElementById('chatbot-widget');
        if (widget) widget.classList.add('hidden');
        return;
    }
    const widget = document.getElementById('chatbot-widget');
    if (widget) widget.classList.remove('hidden');

    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const chatForm = document.getElementById('chat-form');
    const panel = document.getElementById('chat-panel');

    if (toggleBtn) {
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
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            chatOpen = false;
            panel.classList.add('hidden');
            panel.classList.remove('flex');
        };
    }

    if (chatForm) {
        chatForm.onsubmit = async (e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const msg = input.value.trim();
            if (!msg) return;
            input.value = '';
            await sendMessage(msg);
        };
    }

    window.chatbot = { sendQuickMessage };
}

async function sendMessage(message) {
    const messages = document.getElementById('chat-messages');

    // Add user message bubble
    messages.innerHTML += `
        <div class="chat-bubble-user self-end px-4 py-2.5 rounded-2xl rounded-tr-xs text-xs font-medium max-w-[85%] bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20 animate-fadeIn">
            ${escapeForChat(message)}
        </div>
    `;

    // Show typing indicator
    const typingId = 'typing-' + Date.now();
    messages.innerHTML += `
        <div id="${typingId}" class="self-start bg-white/10 p-3 rounded-2xl rounded-tl-xs max-w-[85%] border border-white/5">
            <div class="typing-indicator flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse delay-1"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse delay-2"></span>
            </div>
        </div>
    `;
    scrollChat();

    // Disable input while generating
    const input = document.getElementById('chat-input');
    if (input) input.disabled = true;

    try {
        const data = await api.post('/chatbot/ask', { message });
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        messages.innerHTML += `
            <div class="chat-bubble-ai self-start bg-white/10 p-3 rounded-2xl rounded-tl-xs text-xs text-gray-200 leading-relaxed max-w-[85%] border border-white/5 animate-fadeIn">
                ${escapeForChat(data.response)}
            </div>
        `;

        // Update quick suggestions
        if (data.suggestions && data.suggestions.length > 0) {
            const sugContainer = document.getElementById('chat-suggestions');
            if (sugContainer) {
                sugContainer.innerHTML = data.suggestions.map(s =>
                    `<button class="skill-tag text-[11px] bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10 transition-colors whitespace-nowrap" onclick="window.chatbot.sendQuickMessage('${s.replace(/'/g, "\\'")}')">${s}</button>`
                ).join('');
            }
        }
    } catch {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        messages.innerHTML += `
            <div class="self-start bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl rounded-tl-xs text-xs max-w-[85%] text-rose-400 animate-fadeIn">
                Sorry, I couldn't process your request. Please try again.
            </div>
        `;
    } finally {
        if (input) {
            input.disabled = false;
            input.focus();
        }
        scrollChat();
    }
}

async function sendQuickMessage(msg) {
    const input = document.getElementById('chat-input');
    if (input && input.disabled) return;
    if (!chatOpen) {
        const panel = document.getElementById('chat-panel');
        chatOpen = true;
        if (panel) {
            panel.classList.remove('hidden');
            panel.classList.add('flex');
        }
    }
    await sendMessage(msg);
}

async function loadHistory() {
    try {
        const history = await api.get('/chatbot/history');
        if (history && history.length > 0) {
            const messages = document.getElementById('chat-messages');
            let html = `
                <div class="chat-bubble-ai self-start bg-white/10 p-3 rounded-2xl rounded-tl-xs text-xs text-gray-200 leading-relaxed max-w-[85%] border border-white/5">
                    Hello! I'm your CareerAI assistant. How can I help with your career path or resume today?
                </div>
            `;
            history.forEach(h => {
                html += `
                    <div class="chat-bubble-user self-end px-4 py-2.5 rounded-2xl rounded-tr-xs text-xs font-medium max-w-[85%] bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20">${escapeForChat(h.message)}</div>
                    <div class="chat-bubble-ai self-start bg-white/10 p-3 rounded-2xl rounded-tl-xs text-xs text-gray-200 leading-relaxed max-w-[85%] border border-white/5">${escapeForChat(h.response)}</div>
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
