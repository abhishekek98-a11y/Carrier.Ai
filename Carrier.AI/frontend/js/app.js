// frontend/js/app.js
import { isAuthenticated, removeToken, api } from './api.js';
import { renderLoginPage, renderSignupPage } from './auth.js';
import { renderProfilePage } from './profile.js';
import { renderResumePage } from './resume.js';
import { renderCareerPage } from './career.js';
import { renderRoadmapPage } from './roadmap.js';
import { initChatbot } from './chatbot.js';
import { renderDashboardPage } from './dashboard.js';
import { showToast } from './utils.js';

let currentUser = null;

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'profile', label: 'Student Profile', icon: '🎓' },
    { id: 'resume', label: 'Resume Analyzer', icon: '📄' },
    { id: 'careers', label: 'Career AI', icon: '🚀' },
    { id: 'roadmap', label: 'Learning Roadmap', icon: '🗺️' },
];

function getPage() {
    const hash = window.location.hash.replace('#', '').split('?')[0] || '';
    return hash || (isAuthenticated() ? 'dashboard' : 'login');
}

function renderNav(page) {
    return `
        <div class="sidebar custom-scrollbar" id="sidebar">
            <div class="p-6 border-b border-white/10 flex items-center justify-between">
                <a href="#dashboard" class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
                        🎯
                    </div>
                    <div>
                        <h1 class="font-heading text-xl font-bold gradient-text leading-tight">CareerAI</h1>
                        <p class="text-[10px] text-gray-400 tracking-wider uppercase font-semibold">Guidance Platform</p>
                    </div>
                </a>
                <button onclick="window.toggleSidebar()" class="text-gray-400 hover:text-white md:hidden">
                    ✕
                </button>
            </div>
            <nav class="p-4 flex-1 space-y-1">
                ${NAV_ITEMS.map(item => `
                    <a href="#${item.id}" class="sidebar-link ${page === item.id ? 'active' : ''}">
                        <span class="text-lg">${item.icon}</span>
                        <span>${item.label}</span>
                    </a>
                `).join('')}
            </nav>
            <div class="p-4 border-t border-white/10 bg-white/[0.02]">
                <div class="flex items-center gap-3 mb-3 p-2 rounded-xl bg-white/5 border border-white/5">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center font-bold text-white text-sm shadow-md">
                        ${currentUser ? currentUser.full_name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold truncate text-gray-200">${currentUser ? currentUser.full_name : 'User'}</p>
                        <p class="text-xs text-gray-400 truncate">${currentUser ? currentUser.email : ''}</p>
                    </div>
                </div>
                <button onclick="window.logout()" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 text-sm font-medium">
                    <span>🚪</span> Log out
                </button>
            </div>
        </div>

        <!-- Mobile Header -->
        <div class="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between md:hidden shadow-lg">
            <button onclick="window.toggleSidebar()" class="text-gray-200 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <a href="#dashboard" class="flex items-center gap-2">
                <span class="text-xl">🎯</span>
                <span class="font-heading font-bold text-lg gradient-text">CareerAI</span>
            </a>
            <div class="w-10"></div>
        </div>
        <div id="sidebar-overlay" class="hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-20 md:hidden" onclick="window.toggleSidebar()"></div>
    `;
}

async function renderPage() {
    const page = getPage();
    const app = document.getElementById('app');

    // Auth pages (no nav)
    if (page === 'login') { renderLoginPage(); initChatbot(); return; }
    if (page === 'signup') { renderSignupPage(); initChatbot(); return; }

    // Protected pages - check auth
    if (!isAuthenticated()) {
        window.location.hash = '#login';
        return;
    }

    // Fetch user if not loaded
    if (!currentUser) {
        try {
            currentUser = await api.get('/auth/me');
        } catch {
            removeToken();
            window.location.hash = '#login';
            return;
        }
    }

    // Render layout
    app.innerHTML = `
        ${renderNav(page)}
        <div class="layout-container">
            <main class="main-content custom-scrollbar" id="page-content"></main>
        </div>
    `;

    const content = document.getElementById('page-content');

    switch (page) {
        case 'dashboard':
            renderDashboardPage(content, currentUser.full_name);
            break;
        case 'profile':
            renderProfilePage(content);
            break;
        case 'resume':
            renderResumePage(content);
            break;
        case 'careers':
            renderCareerPage(content);
            break;
        case 'roadmap':
            renderRoadmapPage(content);
            break;
        default:
            renderDashboardPage(content, currentUser.full_name);
    }

    initChatbot();
}

// Global functions
window.logout = function() {
    removeToken();
    currentUser = null;
    showToast('Logged out successfully', 'info');
    window.location.hash = '#login';
};

window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('hidden');
    }
};

// Close sidebar on link click (mobile)
document.addEventListener('click', (e) => {
    if (e.target.closest('.sidebar a')) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar && window.innerWidth < 768) {
            sidebar.classList.remove('open');
            if (overlay) overlay.classList.add('hidden');
        }
    }
});

// Router
window.addEventListener('hashchange', renderPage);

// Initial render
renderPage();
